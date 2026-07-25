"use client";

import React from "react";
import Table, { Column } from "./Table";
import { Category } from "@/types/category";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

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
      cellClassName: "text-xs font-semibold text-quaternary",
    },
    {
      header: "Name",
      key: "name",
      render: (value) => (
        <span className="text-sm font-semibold text-primary">
          {String(value)}
        </span>
      ),
    },
    {
      header: "Description",
      key: "description",
      render: (value) => (
        <p className="max-w-md truncate text-sm text-tertiary">
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
          <Badge type="pill-color" color="gray" size="sm">
            {count} product{count !== 1 ? "s" : ""}
          </Badge>
        );
      },
    },
    {
      header: "Created",
      key: "createdAt",
      render: (value) =>
        value ? (
          <span className="text-xs text-tertiary">
            {new Date(value as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-quaternary">—</span>
        ),
    },
    {
      header: "Status",
      key: "status",
      render: (_, item) => (
        <BadgeWithDot
          type="pill-color"
          color={item.status ? "success" : "error"}
          size="sm"
        >
          {item.status ? "Active" : "Inactive"}
        </BadgeWithDot>
      ),
    },
    {
      header: "Action",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleEdit?.(item)}
            className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
            aria-label="Edit category"
          >
            <Edit01 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary"
            aria-label="Delete category"
          >
            <Trash01 className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-quaternary transition hover:bg-secondary hover:text-primary"
            aria-label="More options"
          >
            <DotsVertical className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return <Table data={categories} columns={columns} rowKey="id" />;
};

export default CategoryTable;

