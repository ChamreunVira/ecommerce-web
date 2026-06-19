"use client";

import { useAppContext } from "@/context/AppContext";
import { categoryService } from "@/services/category-service";
import { productService } from "@/services/product-service";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ChevronRight, Home, ImagePlus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

const initialProduct: Partial<Product> = {
  categoryId: 0,
  name: "",
  description: "",
  price: 0,
  discount: 0,
  qty: 0,
};

export default function CreateProductPage() {
  const { router, user, sessionReady } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] =
    useState<Partial<Product>>(initialProduct);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const previewImages = useMemo(
    () =>
      images.map((image) => ({
        name: image.name,
        url: URL.createObjectURL(image),
      })),
    [images],
  );

  useEffect(() => {
    if (!sessionReady) return;
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success) setCategoryData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, [sessionReady]);

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [previewImages]);

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const numericFields = ["categoryId", "price", "discount", "qty"];
    setProductData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...incoming]);
  };

  const handleDropImage = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length > 0) setImages((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleRemoveImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productData.categoryId) {
      toast.warning("Please select a category.");
      return;
    }

    setIsLoading(true);
    const form = new FormData();
    form.append("categoryId", String(productData.categoryId));
    form.append("name", String(productData.name));
    form.append("description", String(productData.description));
    form.append("price", String(productData.price));
    form.append("discount", String(productData.discount));
    form.append("qty", String(productData.qty));
    form.append("userId", String(user?.id));
    images.forEach((img) => form.append("images", img));

    try {
      const response = await productService.create(form);
      if (response.success) {
        toast.success("Product created successfully.");
        router.push("/admin/product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Link
          href="/admin/product"
          className="hover:text-slate-800 transition-colors"
        >
          Products
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-orange-600">Add New Product</span>
      </nav>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          Add New Product
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new product to your store.
        </p>
      </div>

      {/* Form */}
      <form id="create-product-form" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            {/* Name & Description */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-slate-900">
                Name and Description
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Wireless Headphones"
                    value={productData.name}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    placeholder="Describe the product…"
                    value={productData.description}
                    onChange={handleFieldChange}
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-slate-900">
                Category
              </h2>
              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Product Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  value={productData.categoryId}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">— Select a category —</option>
                  {categoryData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manage Stock */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-slate-900">
                Manage Stock
              </h2>
              <div>
                <label
                  htmlFor="qty"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Product Stock
                </label>
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  value={productData.qty}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Product Pricing */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-slate-900">
                Product Pricing
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                      $
                    </span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={productData.price}
                      onChange={handleFieldChange}
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-7 pr-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Discount <span className="text-slate-400">(% off)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={productData.discount}
                      onChange={handleFieldChange}
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-3 pr-8 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-slate-900">
                Product Image
              </h2>

              {/* Drop zone */}
              <div
                onDrop={handleDropImage}
                onDragOver={handleDragOver}
                className="relative"
              >
                <label
                  htmlFor="images"
                  className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-orange-300 hover:bg-orange-50/40"
                >
                  <ImagePlus className="text-slate-400" size={26} />
                  <span className="mt-2 text-sm font-medium text-slate-700">
                    Click to Upload
                  </span>
                  <span className="mt-0.5 text-xs text-slate-400">
                    PNG, JPG or JPEG
                  </span>
                </label>
                <input
                  id="images"
                  type="file"
                  onChange={handleImagesChange}
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  className="sr-only"
                />
              </div>

              {/* Image previews */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {previewImages.map((img, i) => (
                    <div
                      key={`${img.name}-${i}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link
            href="/admin/product"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {isLoading ? "Creating..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
