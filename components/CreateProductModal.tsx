"use client";

import { X } from "lucide-react";
import React, { useState } from "react";

type CreateProductModalType = {
  handleCloseModal: () => void
}

type ProductData = {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  qty: number;
}

const CreateProductModal: React.FC<CreateProductModalType> = ({handleCloseModal}) => {
  
  const [productData , setProductData] = useState<ProductData>({
    categoryId: 0,
    name: "",
    description: "",
    price: 0,
    discount: 0,
    qty: 0
  })

  const [images , setImages] = useState<any | null>(null);

  const handleCreateProduct = () => {
    
  }

  const handleProductFielsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  return (
    <div className="w-full min-h-screen absolute top-0 left-0 bg-black/10 flex items-center justify-center">
      <div className="relative rounded-md border border-gray-300 min-w-2xl p-8 bg-white">
        <button
          onClick={handleCloseModal}
          className="absolute top-8 right-8 w-5 h-5 rounded-full"
        >
          <X />
        </button>
        <h1 className="text-2xl text-gray-800 pb-4">Product Form</h1>
        <form action="">
          <div className="mb-4">
            <label className="text-sm text-gray-800">Category</label>
            <select
            // onChange={handleProductFielsChange}
              className="w-full border border-gray-300 px-3 py-1.5"
            >
              <option>category</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-800">Name</label>
            <input
              type="text"
              onChange={handleProductFielsChange}
              placeholder="Enter name..."
              name="name"
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-800">Description</label>
            <input
              type="text"
              placeholder="Enter description..."
              name="price"
              onChange={handleProductFielsChange}
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-800">Price</label>
            <input
              type="text"
              placeholder="Enter price..."
              name="price"
              onChange={handleProductFielsChange}
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-800">Discount</label>
            <input
              type="text"
              placeholder="Enter discount..."
              name="email"
              value={0}
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-800">Quantity</label>
            <input
              type="text"
              placeholder="Enter quantity..."
              name="email"
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-800">Images</label>
            <input
              type="file"
              placeholder="Enter name..."
              name="email"
              accept="png,jpg,jpeg"
              multiple
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <button className="w-full px-3 py-1.5 bg-orange-500 text-white">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
