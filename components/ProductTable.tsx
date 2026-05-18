import { assets } from "@/assets/assets";
import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";
import Table, { Column } from "./Table";

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const columns: Column<Product>[] = [
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
        const image =
          Array.isArray(value) && value.length > 0
            ? `http://localhost:8080/api/v1/uploads/${value[0]}`
            : assets.brand;

        return (
          <Image
            src={image}
            alt={product.name}
            width={60}
            height={60}
            className="rounded object-cover"
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
  ];

  return <Table data={products} columns={columns} />;
};

export default ProductTable;
