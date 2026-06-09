"use client";

import { useAppContext } from "@/context/AppContext";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type CreateProductModalType = {
  calllbackFromCreateProductModal: () => void;
  closeModal: () => void;
};

const CreateProductModal: React.FC<CreateProductModalType> = ({
  calllbackFromCreateProductModal,
  closeModal
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productData, setProductData] = useState<Partial<Product>>({
    categoryId: 0,
    name: "",
    description: "",
    price: 0,
    discount: 0,
    qty: 0,
  });
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [images, setImages] = useState<File[] | null>(null);
  const {user} = useAppContext();


  const handleSubmitProduct = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData();

    form.append("categoryId", String(productData.categoryId));

    form.append("name", String(productData.name));

    form.append("description", String(productData.description));

    form.append("price", String(productData.price));

    form.append("discount", String(productData.discount));

    form.append("qty", String(productData.qty));

    form.append("userId", String(user.id));

    if (images) {
      for (let i = 0; i < images.length; i++) {
        form.append("images", images[i]);
      }
    }

    try {
      const response = await productService.create(form);
      if (response.success) {
        toast.success("Product created successfully");
        calllbackFromCreateProductModal();
        closeModal();
      }
    } catch (e: any) {
      console.log(e.message);
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategoryData(response.data);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  const handleProductFieldsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e: any) => {
    const files = e.target.files;
    setImages(files);
  };

  useEffect(() => {
    handleFetchCategory();
    return () => new AbortController().abort();
  }, [])

  return (
    <div className="w-full min-h-screen absolute top-0 left-0 bg-black/10 flex items-center justify-center">
      <div className="relative rounded-md border border-gray-300 max-w-2xl p-8 bg-white">
        <button
          onClick={() => closeModal()}
          className="absolute top-8 right-8 w-5 h-5 rounded-full"
        >
          <X />
        </button>
        <h1 className="text-2xl text-gray-800 pb-4">Product Form</h1>
        <form onSubmit={handleSubmitProduct}>

          <div className="flex gap-4">
            <div className="mb-4 w-full">
              <label className="text-sm text-gray-800">Category</label>
              <select
                name="categoryId"
                value={productData.categoryId}
                onChange={handleProductFieldsChange}
                className="w-full border rounded-md border-gray-300 px-3 py-1.5">
                <option
                  value="">Select a category</option>
                {categoryData.map((category, i) => (
                  <option key={i} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 w-full">
              <label className="text-sm text-gray-800">Name</label>
              <input
                type="text"
                onChange={handleProductFieldsChange}
                placeholder="Enter name..."
                name="name"
                value={productData.name}
                className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
              />
            </div>

          </div>

          <div className="flex gap-4">
            <div className="mb-4">
              <label className="text-sm text-gray-800">Price</label>
              <input
                type="text"
                placeholder="Enter price..."
                name="price"
                value={productData.price}
                onChange={handleProductFieldsChange}
                className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
              />

            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-800">Discount</label>
              <input
                type="text"
                placeholder="Enter discount..."
                name="discount"
                onChange={handleProductFieldsChange}
                className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-800">Quantity</label>
              <input
                type="text"
                placeholder="Enter quantity..."
                name="qty"
                onChange={handleProductFieldsChange}
                className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
              />
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="text-sm text-gray-800">Description</label>
            <textarea
              placeholder="Enter description..."
              name="description"
              value={productData.description}
              onChange={handleProductFieldsChange}
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <div className="mb-4">
            <div className="p-2">
              <p>Preview Image: </p>
                <div className="flex gap-2.5 py-2">
                  {images && [...images].map((img) => (
                    <img key={img.name} src={URL.createObjectURL(img)} alt="Preview" className="w-32 h-32 object-cover" />
                  ))}
                </div>
            </div>
            <label className="text-sm text-gray-800">Images</label>
            <input
              type="file"
              placeholder="Enter name..."
              onChange={handleImagesChange}
              accept="png,jpg,jpeg"
              multiple
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>

          <button disabled={isLoading} type="submit" className="w-full px-3 py-1.5 bg-orange-500 text-white">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
