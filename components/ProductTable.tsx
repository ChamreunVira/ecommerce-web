"use client";
import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";
import Table, { Column } from "./Table";
import { Edit, Trash } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  handleDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, handleDelete }) => {
  const columns: Column<Product | any>[] = [
    {
      header: "#",
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
          <div className="relative w-16 h-16">
            {images.slice(0, 3).map((img, i) => (
              <Image
                key={i}
                src={`http://localhost:8080/api/v1/uploads/${img}`}
                alt={product.name}
                width={64}
                height={64}
                className="absolute top-0 left-0 object-cover w-full h-full rounded border border-white shadow-sm transition-transform duration-200 hover:translate-y-1"
                unoptimized
                style={{
                  zIndex: 10 - i,
                  transform: `translate(${i * 6}px, ${i * 6}px)`,
                }}
              />
            ))}
          </div>
        );
      }
    },
    {
      header: "Category",
      key: "categoryName",
      render: (value) => <p className="text-sm text-gray-500">{value}</p>,
    },
    {
      header: "Name",
      key: "name",
      render: (value) => <p className="font-medium">{value}</p>,
    },
    {
      header: "Description",
      key: "description",
      render: (value) => <p className="text-sm text-gray-500">{value}</p>,
    },
    {
      header: "Price",
      key: "price",
      render: (value) => (<p className="text-emerald-500 font-medium">${value.toFixed(2)}</p>),
    },
    {
      header: "Discount",
      key: "discount",
      render: (value) => (<p className="text-rose-500 font-medium">{value}%</p>),
    },
    {
      header: "Created At",
      key: "createdAt",
    },
    {
      header: "Updated At",
      key: "updatedAt",
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-amber-500 rounded-full hover:bg-amber-100">
            <Edit className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-rose-500 p-1.5 rounded-full hover:bg-rose-100">
            <Trash className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={products} columns={columns} />;
};

export default ProductTable;
