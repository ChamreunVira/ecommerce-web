"use client";
import CategoryTable from "@/components/CategoryTable";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import Loading from "@/components/Loading";
import SearchInput from "@/components/SearchInput";
import StatsCard from "@/components/StatsCard";
import UpdateCategoryModal from "@/components/UpdateCategoryModal";
import { useAppContext } from "@/context/AppContext";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { AlertCircle, ChevronRight, Home, Package, PackageOpen, Plus, Tag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CategoryAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteByCategory = async (id: number) => {
    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        toast.success("Category deleted successfully.");
        handleFetchCategory();
      }
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  const handleSearchByName = (name: string) => {
    const q = name.toLowerCase();
    setFilteredCategories(
      name.trim()
        ? categories.filter((c) => c.name.toLowerCase().includes(q))
        : [],
    );
  };

  useEffect(() => {
    if (!sessionReady) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await categoryService.getAll();
        if (response.success) setCategories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionReady]);

  const displayed =
    filteredCategories.length > 0 ? filteredCategories : categories;

  const totalProducts = categories.reduce(
    (sum, c) => sum + (Array.isArray(c.products) ? c.products.length : 0),
    0,
  );

  const statCards = [
    {
      label: "Total Categories",
      value: categories.length,
      color: "text-slate-900",
    },
    {
      label: "Total Products",
      value: totalProducts,
      color: "text-emerald-600",
    },
    {
      label: "Empty",
      value: categories.filter((c) => !c.products?.length).length,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 hover:text-slate-800 transition-colors"
        >
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Categories List</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Categories List
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, search, edit, and organize product categories.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
        <StatsCard icon={<Tag className="text-orange-500" />} accent="bg-orange-50" label="Categories" value={categories.length} trend={+3} />
        <StatsCard icon={<Package className="text-orange-500" />} accent="bg-orange-50" label="Products" value={totalProducts} trend={+10} />
        <StatsCard icon={<PackageOpen className="text-orange-500" />} accent="bg-orange-50" label="Empty" value={categories.filter((c) => !c.products?.length).length} trend={-1} />
        {/* show activate */}
        {/* <StatsCard */}
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <CategoryTable
          categories={displayed}
          handleDelete={handleDeleteByCategory}
          handleEdit={setEditingCategory}
        />
      )}

      {isModalOpen && (
        <CreateCategoryModal
          handleClose={() => {
            setIsModalOpen(false);
            handleFetchCategory();
          }}
        />
      )}

      {editingCategory && (
        <UpdateCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdated={handleFetchCategory}
        />
      )}
    </div>
  );
};

export default CategoryAdminPage;
