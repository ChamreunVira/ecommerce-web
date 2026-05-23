"use client";
import CategoryTable from "@/components/CategoryTable";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { Compass, List } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (e: any) {
      console.log(e.message);
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
    } catch (e: any) {
      toast.error("Failare to deleted category.")
      console.log(e.message);
    }
  }

  const handleSearchByName = (name: string) => {
    const filtered = categories.filter((category) => category.name.toLowerCase().includes(name.toLowerCase()));
    setFilteredCategories(filtered);
  }

  useEffect(() => {
    handleFetchCategory();
    return () => new AbortController().abort();
  }, []);

  return (
    <section className="p-12">
      <div className="border border-slate-300 p-6 rounded-md bg-white">
        <div className="flex flex-col justify-center gap-2 mb-8 ">
          <h1 className="text-slate-800/90 text-2xl font-semibold">
            <button className="mr-2">
              <List className="text-slate-800/90" />
            </button>Category</h1>
          <p className="text-base text-gray-500/90">Product management</p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1.5 rounded-md outline-1 -outline-offset-2 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500"
              onChange={(e) => handleSearchByName(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="px-3 py-1.5 bg-orange-500 rounded-md text-white"
            >
              Create
            </button>
          </div>
        </div>

        <CategoryTable categories={filteredCategories.length > 0 ? filteredCategories : categories} handleDelete={handleDeleteByCategory} />

        {isModalOpen && <CreateCategoryModal handleClose={handleCallbackFromModal} />}
      </div>
    </section>
  );
};

export default CategoryAdminPage;
