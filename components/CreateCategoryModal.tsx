"use client";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { X } from "lucide-react";
import React from "react";

type CreateCategoryModalProps = {
  handleClose: () => void;
};

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  handleClose,
}) => {
  const [categoryData, setCategoryData] = React.useState<Omit<Category, "id" | "createdAt" | "updatedAt" , "products">>(() => ({
    name: "",
    description: "",
  }));
  const handleCategoryFieldsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setCategoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitCategory = async () => {
    try {
        const response = await categoryService.create(categoryData);
        if(response.success) {
            handleClose();
        }

    }catch(e: any) {
        console.log(e.message);
    }
}

  return (
    <div className="absolute top-0 left-0 bg-black/10 flex items-center justify-center w-full min-h-screen">
      <div className="max-w-lg w-full bg-zinc-50 rounded-md border border-gray-300 p-8 relative">
        <button className="absolute top-8 right-8 text-slate-800 cursor-pointer" onClick={handleClose}>
          <X />
        </button>
        <h2 className="text-2xl font-medium text-slate-800 pb-4">Category Form</h2>
        <form action="">
          <div className="mb-4">
            <label className="text-sm text-gray-800">Name</label>
            <input
              type="text"
              onChange={handleCategoryFieldsChange}
              placeholder="Enter name..."
              name="name"
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-800">Description</label>
            <textarea
              placeholder="Enter description..."
              name="description"
              onChange={handleCategoryFieldsChange}
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>
          <button 
            type="button"
            onClick={handleSubmitCategory}
            className="px-3 py-1.5 w-full rounded-md bg-orange-500 text-white"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
