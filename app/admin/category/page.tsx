"use client";
import CategoryTable from "@/components/CategoryTable";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { Compass } from "lucide-react";
import React, { useEffect, useState } from "react";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    handleFetchCategory();  
    return () => new AbortController().abort();
  }, []);

  return (
    <section className="p-12">
      <div className="flex items-center gap-2 font-semibold mb-8 text-2xl">
        <button>
          <Compass className="text-slate-800/90"/>
        </button>
        <h1 className="text-slate-800/90">Category Management</h1>
      </div>
            <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1.5 rounded-md outline-1 -outline-offset-2 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500"
          />

          {/* <select className="px-3 py-1.5 rounded-md border border-gray-300">
            <option defaultValue={categories[0]}>{categories[0]}</option>
            {categories.map((_, i) => (
              <option key={i}>{categories[(i + 1) / categories.length]}</option>
            ))}
          </select> */}
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-orange-500 rounded-md text-white"
          >
            Create
          </button>
        </div>
      </div>
        <CategoryTable categories={categories} />
      {isModalOpen && <CreateCategoryModal handleClose={() => setIsModalOpen(false)} />}
    </section>
  );
};

export default CategoryAdminPage;
