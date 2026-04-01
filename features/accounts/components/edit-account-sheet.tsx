import { z } from "zod";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDataStore } from "@/features/store/data-store";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";

import { AccountForm } from "./account-form";

const formSchema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const accounts = useDataStore((s) => s.accounts);
  const editAccount = useDataStore((s) => s.editAccount);
  const deleteAccount = useDataStore((s) => s.deleteAccount);
  const role = useDataStore((s) => s.role);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account."
  );

  const account = accounts.find((a) => a.id === id);

  const defaultValues = account
    ? { name: account.name }
    : { name: "" };

  const onSubmit = (values: FormValues) => {
    if (role === "viewer") {
      toast.error("Viewers cannot edit accounts.");
      return;
    }
    if (!id) return;
    editAccount(id, values);
    toast.success("Account updated.");
    onClose();
  };

  const onDelete = async () => {
    if (role === "viewer") {
      toast.error("Viewers cannot delete accounts.");
      return;
    }
    const ok = await confirm();
    if (ok && id) {
      deleteAccount(id);
      toast.success("Account deleted.");
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account.</SheetDescription>
          </SheetHeader>

          <AccountForm
            id={id}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            disabled={role === "viewer"}
            onDelete={onDelete}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
