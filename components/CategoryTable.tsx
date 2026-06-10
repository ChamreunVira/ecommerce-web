import React from "react";
import Table, { Column } from "./Table";
import { Category } from "@/types/category";
import { Edit, Trash } from "lucide-react";

interface CategoryTableProps {
  categories: Category[];
  handleDelete: (id: number) => void;
  handleEdit?: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, handleDelete, handleEdit }) => {
  const columns: Column<Category>[] = [
    {
      header: "No.",
      key: "id",
      className: "w-20",
      cellClassName: "font-semibold text-slate-800",
    },
    {
      header: "Name",
      key: "name",
      render: (value) => <span className="font-semibold text-lg text-slate-800/90">{String(value)}</span>,
    },
    {
      header: "Description",
      key: "description",
      render: (value) => <p className="max-w-md truncate text-slate-500">{String(value)}</p>,
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (value) => formatDate(value),
    },
    {
      header: "Updated At",
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
            type="button"
            onClick={() => handleEdit?.(item)}
            className="rounded-full p-2 text-amber-600 transition hover:bg-amber-50"
            aria-label="Edit category"
          >
            <Edit size={17} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="rounded-full p-2 text-rose-600 transition hover:bg-rose-50"
            aria-label="Delete category"
          >
            <Trash size={17} />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={categories} columns={columns} />;
};

export default CategoryTable;

function formatDate(value: unknown) {
  if (!value) return <span className="text-slate-400">-</span>;
  return <span className="text-sm text-slate-500">{new Date(value as string).toLocaleDateString()}</span>;
}
