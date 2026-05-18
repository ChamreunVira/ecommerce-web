"use client";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import React, { useEffect, useState } from "react";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState<Partial<Category[]>>([]);

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
    console.log(categories);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="text-rose-500 font-semibold text-center mt-20">CategoryAdminPage</div>
    </div>
  );
};

export default CategoryAdminPage;
