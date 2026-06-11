"use client";

import { ImagePlus, Save } from "lucide-react";
import type { ChangeEvent, EventHandler, FormEvent, SubmitEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";
import { Product } from "@/types/product";
import { productService } from "@/services/product-service";
import { Category } from "@/types/category";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

type CategoryFormData = Omit<Product, "id" | "categoryName" | "username" | "createdAt" | "updatedAt">;

type UpdateCategoryModalProps = {
    categories: Category[];
    product: Product;
    onClose: () => void;
    onUpdated: () => void;
};

export default function UpdateProductModal({ categories, product, onClose, onUpdated}: UpdateCategoryModalProps) {


    const [formData, setFormData] = useState<CategoryFormData>({
        categoryId: product.categoryId,
        userId: product.userId,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        qty: product.qty,
        images: product.images,
    });
    const { user } = useAppContext();
    const [images, setImages] = useState<File[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const previewImages = useMemo(() => {
        return images.map(img => ({
            name: img.name,
            url: URL.createObjectURL(img)
        }))
    }, [images])

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;
        const numericFields = ["categoryId", "price", "discount", "qty"];
        setFormData((current) => ({
            ...current,
            [name]: numericFields.includes(name) ? Number(value) : value,
        }));
    };

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        setIsSaving(true);

        const form = new FormData();
        form.append("categoryId", String(formData.categoryId));
        form.append("name", String(formData.name));
        form.append("description", String(formData.description));
        form.append("price", String(formData.price));
        form.append("discount", String(formData.discount));
        form.append("qty", String(formData.qty));
        form.append("userId", String(user.id));
        images.forEach((image) => form.append("images", image));

        try {
            const response = await productService.update(product.id, formData);
            if (response.success) {
                toast.success("Product created successfully.");
                onUpdated();
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create product.");
        } finally {
            setIsSaving(false)
        }
    };

    const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImages(Array.from(event.target.files || []));
    };

    useEffect(() => console.log(categories) , [])

    return (
        <AdminModal
            title="Update product"
            description="update product."
            onClose={onClose}
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        form="update-product-form"
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            }
        >
            <form id="update-product-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="categoryId">
                        Category
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={() => (null)}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
                        required
                    >
                        <option value={product.categoryId}>{product.categoryName}</option>
                        {categories.map((category) => (
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
                        onChange={handleChange}
                        placeholder="Wireless headphone"
                        name="name"
                        value={formData.name}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500"
                        required
                    />
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
                            value={formData.price}
                            onChange={handleChange}
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
                            type="number"
                            min="0"
                            max="100"
                            placeholder="10"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
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
                            value={formData.qty}
                            onChange={handleChange}
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
                        value={formData.description}
                        onChange={handleChange}
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
                    ) : (
                        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {product.images.map((image, i) => (
                                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                                    <Image src={`http://localhost:8080/api/v1/uploads/${image}`} alt={image} fill className="object-cover" unoptimized />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </AdminModal >
    );
}
