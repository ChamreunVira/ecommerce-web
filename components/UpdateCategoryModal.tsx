"use client";

import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { Save } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";

type CategoryFormData = Omit<Category, "id" | "createdAt" | "updatedAt">;

type UpdateCategoryModalProps = {
  category: Category;
  onClose: () => void;
  onUpdated: () => void;
};

export default function UpdateCategoryModal({
  category,
  onClose,
  onUpdated,
}: UpdateCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category.name,
    description: category.description,
    status: category.status,
    products: category.products || [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await categoryService.update(category.id, formData);
      if (response.success) {
        toast.success("Category updated successfully.");
        onUpdated();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      title="Update category"
      description="update category."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            form="update-category-form"
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      }
    >
      <form id="update-category-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="category-name">
            Name
          </label>
          <input
            id="category-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
            placeholder="Category name"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="category-description">
            Description
          </label>
          <textarea
            id="category-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
            placeholder="Short category description"
            required
          />
        </div>
      </form>
    </AdminModal>
  );
}
