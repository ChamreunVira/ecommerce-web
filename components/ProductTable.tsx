"use client";
import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";
import Table, { Column } from "./Table";
import { Edit, Trash } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  handleDelete: (id: number) => void;
  handleUpdate?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, handleDelete, handleUpdate }) => {
  const columns: Column<Product>[] = [
    {
      header: "ID",
      key: "id",
      className: "w-16",
    },
    {
      header: "Image",
      key: "image",
      className: "w-28",
      render: (value, product) => {
        const images = (product.images as string[]) || [];

        return (
          <div className="relative h-24 w-24">
            {images.length > 0 ? images.slice(0, 3).map((img, i) => (
              <Image
                key={i}
                src={`http://localhost:8080/api/v1/uploads/${img}`}
                alt={product.name}
                width={64}
                height={64}
                className="absolute left-0 top-0 h-20 w-20 rounded-sm bg-slate-100/50 object-cover"
                unoptimized
                style={{
                  zIndex: 10 - i,
                  transform: `translate(${i * 6}px, -${i *6}px)`,
                }}
              />
            )) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 text-xs text-slate-400">
                No img
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: "Category",
      key: "categoryName",
      render: (value) => <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{String(value)}</span>,
    },
    {
      header: "Name",
      key: "name",
      render: (value) => <p className="max-w-48 text-lg truncate font-semibold text-slate-800/90">{String(value)}</p>,
    },
    {
      header: "Description",
      key: "description",
      render: (value) => <p className="max-w-xs truncate text-sm text-slate-500">{String(value)}</p>,
    },
    {
      header: "Quantity",
      key: "qty",
      render: (value) => <p className="text-sm text-slate-500">{Number(value)}</p>,
    },
    {
      header: "Price",
      key: "price",
      render: (value) => (<p className="font-semibold text-lg text-emerald-600">${Number(value).toFixed(2)}</p>),
    },
    {
      header: "Discount",
      key: "discount",
      render: (value) => (<p className="font-semibold text-rose-600">{Number(value)}%</p>),
    },
    {
      header: "Updated",
      key: "updatedAt",
      render: (value) => formatDate(value),
    },
    {
      header: "Actions",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-2">
          <button
          onClick={() => handleUpdate?.(item)}
          className="rounded-full p-2 text-amber-600 transition hover:bg-amber-50" aria-label="Edit product">
            <Edit size={17} />
          </button>
          <button
            onClick={() => handleDelete(Number(item.id))}
            className="rounded-full p-2 text-rose-600 transition hover:bg-rose-50"
            aria-label="Delete product"
          >
            <Trash size={17} />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={products} columns={columns} />;
};

export default ProductTable;

function formatDate(value: unknown) {
  if (!value) return <span className="text-slate-400">-</span>;
  return <span className="text-sm text-slate-500">{new Date(value as string).toLocaleDateString()}</span>;
}
