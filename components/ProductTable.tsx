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
        const imageList = product.images || product.image || [];
        const imageFile = imageList?.length > 0 ? imageList[0] : null;

        if (!imageFile) {
          return (
            <div className="w-15 h-15 bg-gray-100/50 rounded flex items-center justify-center text-[10px] text-gray-400">
              No Image
            </div>
          );
        }

        const image = "http://localhost:8080/api/v1/uploads/" + imageFile;
        return (
          <Image
            src={image}
            alt={product.name || "Product"}
            width={60}
            height={60}
            className="rounded object-cover"
            unoptimized
          />
        );
      },
    },
    {
      header: "category",
      key: "categoryName",
    },
    {
      header: "name",
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
