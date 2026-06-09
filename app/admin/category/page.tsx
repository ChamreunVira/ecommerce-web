"use client";
import CategoryTable from "@/components/CategoryTable";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import SearchInput from "@/components/SearchInput";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { List, Plus } from "lucide-react";
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
    <section className="relative h-full overflow-x-hidden p-12">

      <div className="flex justify-between items-center mb-8">
        <h1 className="flex items-center text-2xl text-gray-800 font-medium leading-12">Product</h1>

        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="flex items-center px-6 py-2 bg-orange-500 rounded-md text-white"
        >
          <span className="mr-2">
            <Plus />
          </span>
          Create
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <SearchInput onInputChange={handleSearchByName} />
      </div>
      
      <CategoryTable categories={filteredCategories.length > 0 ? filteredCategories : categories} handleDelete={handleDeleteByCategory} />

      {isModalOpen && (
        <CreateCategoryModal
          handleClose={handleCallbackFromModal}
        />
      )}

    </section>
  );
};

export default CategoryAdminPage;
