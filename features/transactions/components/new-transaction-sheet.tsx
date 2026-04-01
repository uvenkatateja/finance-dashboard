import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDataStore } from "@/features/store/data-store";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { TransactionForm } from "./transaction-form";

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const addTransaction = useDataStore((s) => s.addTransaction);
  const addAccount = useDataStore((s) => s.addAccount);
  const addCategory = useDataStore((s) => s.addCategory);
  const accounts = useDataStore((s) => s.accounts);
  const categories = useDataStore((s) => s.categories);
  const role = useDataStore((s) => s.role);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const accountOptions = accounts.map((a) => ({
    label: a.name,
    value: a.id,
  }));

  const onCreateAccount = (name: string) => {
    addAccount({ name });
    toast.success("Account created.");
  };

  const onCreateCategory = (name: string) => {
    addCategory({ name });
    toast.success("Category created.");
  };

  const onSubmit = (values: any) => {
    if (role === "viewer") {
      toast.error("Viewers cannot create transactions.");
      return;
    }
    addTransaction({
      ...values,
      date: values.date instanceof Date ? values.date.toISOString() : values.date,
    });
    toast.success("Transaction created.");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>

        <TransactionForm
          onSubmit={onSubmit}
          disabled={role === "viewer"}
          categoryOptions={categoryOptions}
          onCreateCategory={onCreateCategory}
          accountOptions={accountOptions}
          onCreateAccount={onCreateAccount}
        />
      </SheetContent>
    </Sheet>
  );
};
