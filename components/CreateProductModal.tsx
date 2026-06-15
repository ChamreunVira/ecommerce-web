"use client";

import { useAppContext } from "@/context/AppContext";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ImagePlus, Plus } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";

type CreateProductModalType = {
  calllbackFromCreateProductModal: () => void;
  closeModal: () => void;
};

const initialProduct: Partial<Product> = {
  categoryId: 0,
  name: "",
  description: "",
  price: 0,
  discount: 0,
  qty: 0,
};

export default function CreateProductModal({
  calllbackFromCreateProductModal,
  closeModal,
}: CreateProductModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState<Partial<Product>>(initialProduct);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const { user } = useAppContext();

  const previewImages = useMemo(
    () =>
      images.map((image) => ({
        name: image.name,
        url: URL.createObjectURL(image),
      })),
    [images],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success) {
          setCategoryData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [previewImages]);

  const handleSubmitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form = new FormData();
    form.append("categoryId", String(productData.categoryId));
    form.append("name", String(productData.name));
    form.append("description", String(productData.description));
    form.append("price", String(productData.price));
    form.append("discount", String(productData.discount));
    form.append("qty", String(productData.qty));
    form.append("userId", String(user.id));
    images.forEach((image) => form.append("images", image));

    try {
      const response = await productService.create(form);
      if (response.success) {
        toast.success("Product created successfully.");
        calllbackFromCreateProductModal();
        closeModal();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductFieldsChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const numericFields = ["categoryId", "price", "discount", "qty"];
    setProductData((current) => ({
      ...current,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImages(Array.from(event.target.files || []));
  };

  return (
    <AdminModal
      title="Create product"
      description="Add product details, inventory, pricing, and gallery images."
      onClose={closeModal}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            form="create-product-form"
            disabled={isLoading}
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {isLoading ? "Creating..." : "Create product"}
          </button>
        </div>
      }
    >
      <form id="create-product-form" onSubmit={handleSubmitProduct} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="categoryId">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={productData.categoryId}
              onChange={handleProductFieldsChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
              required
            >
              <option value="">Select a category</option>
              {categoryData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              onChange={handleProductFieldsChange}
              placeholder="Wireless headphone"
              name="name"
              value={productData.name}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="129.00"
              name="price"
              value={productData.price}
              onChange={handleProductFieldsChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="discount">
              Discount
            </label>
            <input
              id="discount"
              type="text"
              min="0"
              max="100"
              placeholder="10"
              name="discount"
              value={productData.discount}
              onChange={handleProductFieldsChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="qty">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min="0"
              placeholder="24"
              name="qty"
              value={productData.qty}
              onChange={handleProductFieldsChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Product description"
            name="description"
            value={productData.description}
            onChange={handleProductFieldsChange}
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="images">
            Images
          </label>
          <label
            htmlFor="images"
            className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-orange-300 hover:bg-orange-50/40"
          >
            <ImagePlus className="text-slate-400" size={28} />
            <span className="mt-2 text-sm font-medium text-slate-700">Upload product images</span>
            <span className="mt-1 text-xs text-slate-500">PNG, JPG, or JPEG. Multiple files supported.</span>
          </label>
          <input
            id="images"
            type="file"
            onChange={handleImagesChange}
            accept="image/png,image/jpeg,image/jpg"
            multiple
            className="sr-only"
          />

          {previewImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previewImages.map((image) => (
                <div key={image.name} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                  <Image src={image.url} alt={image.name} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </form>
    </AdminModal>
  );
}
