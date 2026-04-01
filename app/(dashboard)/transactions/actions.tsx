"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataStore } from "@/features/store/data-store";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";

type ActionsProps = {
  id: string;
};

export const Actions = ({ id }: ActionsProps) => {
  const deleteTransaction = useDataStore((s) => s.deleteTransaction);
  const role = useDataStore((s) => s.role);
  const { onOpen } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const handleDelete = async () => {
    if (role === "viewer") {
      toast.error("Viewers cannot delete transactions.");
      return;
    }
    const ok = await confirm();
    if (ok) {
      deleteTransaction(id);
      toast.success("Transaction deleted.");
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={role === "viewer"}
            onClick={() => onOpen(id)}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={role === "viewer"}
            onClick={handleDelete}
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
