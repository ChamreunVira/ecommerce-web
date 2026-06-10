"use client";
import CategoryTable from "@/components/CategoryTable";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import SearchInput from "@/components/SearchInput";
import UpdateCategoryModal from "@/components/UpdateCategoryModal";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCallbackFromModal = () => {
    setIsModalOpen(!isModalOpen);
    handleFetchCategory();
  };

  const handleDeleteByCategory = async (id: number) => {
    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        toast.success("Category deleted successfully.");
        handleFetchCategory();
      }
    } catch (error) {
      toast.error("Failare to deleted category.")
      console.error(error);
    }
  }

  const handleSearchByName = (name: string) => {
    const filtered = categories.filter((category) => category.name.toLowerCase().includes(name.toLowerCase()));
    setFilteredCategories(filtered);
  }

  useEffect(() => {
    const fetchInitialCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialCategories();
  }, []);

  return (
    <section className="min-h-full px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-orange-600">Catalog</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Categories</h1>
            <p className="mt-2 text-sm text-slate-500">Create, search, edit, and organize product categories.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Create category
          </button>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <SearchInput onInputChange={handleSearchByName} />
        </div>

        <CategoryTable
          categories={filteredCategories.length > 0 ? filteredCategories : categories}
          handleDelete={handleDeleteByCategory}
          handleEdit={setEditingCategory}
        />
      </div>

      {isModalOpen && (
        <CreateCategoryModal
          handleClose={handleCallbackFromModal}
        />
      )}

      {editingCategory ? (
        <UpdateCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdated={handleFetchCategory}
        />
      ) : null}

    </section>
  );
};

export default CategoryAdminPage;
