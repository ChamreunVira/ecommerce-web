import { Product } from "@/types/product";
import React from "react";
import Table, { Column } from "./Table";
import { Category } from "@/types/category";
import { Edit, Trash } from "lucide-react";

interface CategoryTableProps {
  categories: Category[];
  handleDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories , handleDelete }) => {
  const columns: Column<Category | any>[] = [
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
    {
      header: "Actions",
      key: "actions",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-amber-500 rounded-full hover:bg-amber-100">
            <Edit className="w-4.5 h-4.5"/>
          </button>
          <button 
          onClick={() => handleDelete(item.id)}
          className="text-rose-500 p-1.5 rounded-full hover:bg-rose-100">
            <Trash className="w-4.5 h-4.5"/>
          </button>
        </div>
      ),
    }
  ];

  return <Table data={categories} columns={columns} />;
};

export default CategoryTable;
