"use client";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataStore } from "@/features/store/data-store";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

import { columns } from "./columns";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const accounts = useDataStore((s) => s.accounts);
  const bulkDeleteAccounts = useDataStore((s) => s.bulkDeleteAccounts);
  const role = useDataStore((s) => s.role);

  return (
    <div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Accounts Page</CardTitle>

          {role === "admin" && (
            <Button size="sm" onClick={newAccount.onOpen}>
              <Plus className="mr-2 size-4" /> Add new
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns}
            data={accounts}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              bulkDeleteAccounts(ids);
            }}
            disabled={role === "viewer"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
