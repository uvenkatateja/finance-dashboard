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
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

import { AccountForm } from "./account-form";

const formSchema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof formSchema>;

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const addAccount = useDataStore((s) => s.addAccount);
  const role = useDataStore((s) => s.role);

  const onSubmit = (values: FormValues) => {
    if (role === "viewer") {
      toast.error("Viewers cannot create accounts.");
      return;
    }
    addAccount(values);
    toast.success("Account created.");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>

        <AccountForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          disabled={role === "viewer"}
        />
      </SheetContent>
    </Sheet>
  );
};
