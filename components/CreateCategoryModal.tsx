"use client";

import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";

type CreateCategoryModalProps = {
  handleClose: () => void;
};

type CategoryFormData = Omit<Category, "id" | "createdAt" | "updatedAt">;

const initialCategory: CategoryFormData = {
  name: "",
  description: "",
  status: true,
  products: [],
};

export default function CreateCategoryModal({ handleClose }: CreateCategoryModalProps) {
  const [categoryData, setCategoryData] = useState<CategoryFormData>(initialCategory);
  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryFieldsChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setCategoryData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmitCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await categoryService.create(categoryData);
      if (response.success) {
        toast.success("Category created successfully.");
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create category.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      title="Create category"
      description="Group products so customers can browse your store faster."
      onClose={handleClose}
      maxWidth="max-w-xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            form="create-category-form"
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {isSaving ? "Creating..." : "Create category"}
          </button>
        </div>
      }
    >
      <form id="create-category-form" onSubmit={handleSubmitCategory} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            onChange={handleCategoryFieldsChange}
            value={categoryData.name}
            placeholder="Accessories"
            name="name"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Short description for this category"
            name="description"
            value={categoryData.description}
            onChange={handleCategoryFieldsChange}
            rows={5}
            className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>
      </form>
    </AdminModal>
  );
}
