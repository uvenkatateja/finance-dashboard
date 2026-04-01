import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDataStore } from "@/features/store/data-store";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";

import { TransactionForm } from "./transaction-form";

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const transactions = useDataStore((s) => s.transactions);
  const accounts = useDataStore((s) => s.accounts);
  const categories = useDataStore((s) => s.categories);
  const editTransaction = useDataStore((s) => s.editTransaction);
  const deleteTransaction = useDataStore((s) => s.deleteTransaction);
  const addAccount = useDataStore((s) => s.addAccount);
  const addCategory = useDataStore((s) => s.addCategory);
  const role = useDataStore((s) => s.role);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const transaction = transactions.find((t) => t.id === id);

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

  const defaultValues = transaction
    ? {
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount.toString(),
        date: transaction.date ? new Date(transaction.date) : new Date(),
        payee: transaction.payee,
        notes: transaction.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  const onSubmit = (values: any) => {
    if (role === "viewer") {
      toast.error("Viewers cannot edit transactions.");
      return;
    }
    if (!id) return;
    editTransaction(id, {
      ...values,
      date: values.date instanceof Date ? values.date.toISOString() : values.date,
    });
    toast.success("Transaction updated.");
    onClose();
  };

  const onDelete = async () => {
    if (role === "viewer") {
      toast.error("Viewers cannot delete transactions.");
      return;
    }
    const ok = await confirm();
    if (ok && id) {
      deleteTransaction(id);
      toast.success("Transaction deleted.");
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction.</SheetDescription>
          </SheetHeader>

          <TransactionForm
            id={id}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            disabled={role === "viewer"}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
            onDelete={onDelete}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
