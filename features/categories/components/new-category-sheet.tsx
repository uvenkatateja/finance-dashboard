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
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

import { CategoryForm } from "./category-form";

const formSchema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof formSchema>;

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const addCategory = useDataStore((s) => s.addCategory);
  const role = useDataStore((s) => s.role);

  const onSubmit = (values: FormValues) => {
    if (role === "viewer") {
      toast.error("Viewers cannot create categories.");
      return;
    }
    addCategory(values);
    toast.success("Category created.");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          disabled={role === "viewer"}
        />
      </SheetContent>
    </Sheet>
  );
};
