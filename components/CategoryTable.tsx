import { Product } from "@/types/product";
import React from "react";
import Table, { Column } from "./Table";
import { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const columns: Column<Category>[] = [
    {
      header: "No.",
      key: "id",
    },
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Description",
      key: "description",
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

  return <Table data={categories} columns={columns} />;
};

export default CategoryTable;
