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
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useConfirm } from "@/hooks/use-confirm";

import { CategoryForm } from "./category-form";

const formSchema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const categories = useDataStore((s) => s.categories);
  const editCategory = useDataStore((s) => s.editCategory);
  const deleteCategory = useDataStore((s) => s.deleteCategory);
  const role = useDataStore((s) => s.role);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  );

  const category = categories.find((c) => c.id === id);

  const defaultValues = category
    ? { name: category.name }
    : { name: "" };

  const onSubmit = (values: FormValues) => {
    if (role === "viewer") {
      toast.error("Viewers cannot edit categories.");
      return;
    }
    if (!id) return;
    editCategory(id, values);
    toast.success("Category updated.");
    onClose();
  };

  const onDelete = async () => {
    if (role === "viewer") {
      toast.error("Viewers cannot delete categories.");
      return;
    }
    const ok = await confirm();
    if (ok && id) {
      deleteCategory(id);
      toast.success("Category deleted.");
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category.</SheetDescription>
          </SheetHeader>

          <CategoryForm
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
