"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataStore } from "@/features/store/data-store";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
import { UploadButton } from "./upload-button";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: [],
};

const TransactionsPage = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const [AccountDialog, confirm] = useSelectAccount();
  const newTransaction = useNewTransaction();
  const transactions = useDataStore((s) => s.transactions);
  const accounts = useDataStore((s) => s.accounts);
  const categories = useDataStore((s) => s.categories);
  const bulkDeleteTransactions = useDataStore((s) => s.bulkDeleteTransactions);
  const bulkCreateTransactions = useDataStore((s) => s.bulkCreateTransactions);
  const role = useDataStore((s) => s.role);

  // Enrich transactions with account/category names
  const enrichedTransactions = transactions.map((t) => ({
    ...t,
    account: accounts.find((a) => a.id === t.accountId)?.name || "Unknown",
    category: categories.find((c) => c.id === t.categoryId)?.name || null,
  }));

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = async (values: any[]) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
      date: typeof value.date === "string" ? value.date : new Date(value.date).toISOString(),
    }));

    bulkCreateTransactions(data);
    toast.success("Transactions imported.");
    onCancelImport();
  };

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />

        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Transaction History
          </CardTitle>

          <div className="flex flex-col items-center gap-x-2 gap-y-2 lg:flex-row">
            {role === "admin" && (
              <>
                <Button
                  size="sm"
                  onClick={newTransaction.onOpen}
                  className="w-full lg:w-auto"
                >
                  <Plus className="mr-2 size-4" /> Add new
                </Button>

                <UploadButton onUpload={onUpload} />
              </>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={enrichedTransactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              bulkDeleteTransactions(ids);
            }}
            disabled={role === "viewer"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
