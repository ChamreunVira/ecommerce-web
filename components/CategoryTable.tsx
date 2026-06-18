import React from "react";
import Table, { Column } from "./Table";
import { Category } from "@/types/category";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface CategoryTableProps {
  categories: Category[];
  handleDelete: (id: number) => void;
  handleEdit?: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  handleDelete,
  handleEdit,
}) => {
  const columns: Column<Category>[] = [
    {
      header: "ID",
      key: "id",
      className: "w-16",
      cellClassName: "text-xs font-semibold text-slate-500",
    },
    {
      header: "Name",
      key: "name",
      render: (value) => (
        <span className="text-sm font-semibold text-slate-800">
          {String(value)}
        </span>
      ),
    },
    {
      header: "Description",
      key: "description",
      render: (value) => (
        <p className="max-w-md truncate text-sm text-slate-500">
          {String(value)}
        </p>
      ),
    },
    {
      header: "Products",
      key: "products",
      render: (value) => {
        const count = Array.isArray(value) ? value.length : 0;
        return (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {count} product{count !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      header: "Created",
      key: "createdAt",
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
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleEdit?.(item)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-amber-500 transition hover:bg-amber-50"
            aria-label="Edit category"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-rose-500 transition hover:bg-rose-50"
            aria-label="Delete category"
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

  return <Table data={categories} columns={columns} rowKey="id" />;
};

export default CategoryTable;
