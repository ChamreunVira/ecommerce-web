"use client";
import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";
import Table, { Column } from "./Table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  handleDelete: (id: number) => void;
  handleUpdate?: (product: Product) => void;
}

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleDelete,
  handleUpdate,
}) => {
  const columns: Column<Product>[] = [
    {
      header: "Product",
      key: "name",
      render: (_, product) => {
        const img = product.images?.[0];
        return (
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm">
              {img ? (
                <Image
                  src={`${BASE_IMG}/${img}`}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                  IMG
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="max-w-48 truncate text-sm font-semibold text-slate-800">
                {product.name}
              </p>
              <p className="mt-0.5 max-w-48 truncate text-xs text-slate-400">
                {product.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      key: "categoryName",
      render: (value) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {String(value)}
        </span>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (value) => (
        <span className="text-sm font-semibold text-slate-900">
          ${Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Discount",
      key: "discount",
      render: (value) => (
        <span
          className={`text-sm font-medium ${Number(value) > 0 ? "text-rose-600" : "text-slate-400"}`}
        >
          {Number(value) > 0 ? `-${Number(value)}%` : "—"}
        </span>
      ),
    },
    {
      header: "Stock",
      key: "qty",
      render: (value) => {
        const qty = Number(value);
        return (
          <span
            className={`text-sm font-medium ${qty <= 0 ? "text-rose-600" : qty < 10 ? "text-amber-600" : "text-slate-700"}`}
          >
            {qty}
          </span>
        );
      },
    },
    {
      header: "Updated",
      key: "updatedAt",
      render: (value) =>
        value ? (
          <span className="text-xs text-slate-500">
            {new Date(value as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      header: "Action",
      key: "actions",
      className: "w-28",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleUpdate?.(item)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-amber-500 transition hover:bg-amber-50"
            aria-label="Edit product"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => handleDelete(Number(item.id))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-rose-500 transition hover:bg-rose-50"
            aria-label="Delete product"
          >
            <Trash size={15} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100">
            <MoreHorizontal size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table data={products} columns={columns} rowKey="id" option={<Option />} />
  );
};

export default ProductTable;

const Option: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <input
            className="px-3 py-2 border border-slate-200 rounded-md"
            type="text"
            placeholder="Search"
          />
        </div>

        <div>
          <select className="px-3 py-2 border border-slate-200 rounded-md">
            All
          </select>
        </div>
      </div>
    </div>
  );
};
