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
      render: (value, product) => (
        <div className="relative w-20 h-20 rounded overflow-hidden">
          {product.images.length > 0 && products.flatMap((img) => {
            const images = product.images as string[];
            console.log("Product Images:", images);
            return images.map((img, i) => (
              <Image
                key={i}
                src={`http://localhost:8080/api/v1/uploads/${img}`}
                alt={product.name}
                width={80}
                height={80}
                className={`object-cover absolute w-full h-full z-${1 + i} translate-x-${i * 10} translate-y-${i * 2} rounded`}
                unoptimized
              />
            ));
          })}
        </div>
      )
    },
    {
      header: "Category",
      key: "categoryName",
    },
    {
      header: "Name",
      key: "name",
      className: "font-medium",
    },
    {
      header: "Description",
      key: "description",
      className: "max-w-xs truncate",
    },
    {
      header: "Price",
      key: "price",
      render: (value) => `$${value}`,
    },
    {
      header: "Discount",
      key: "discount",
      render: (value) => `${value}%`,
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
