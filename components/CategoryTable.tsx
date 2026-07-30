"use client";

import React from "react";
import { Table, TableCard } from "@/components/application/table/table";
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
  return (
    <TableCard.Root>
      <Table aria-label="Categories table">
        <Table.Header>
          <Table.Head id="id" label="ID" isRowHeader />
          <Table.Head id="name" label="Name" allowsSorting />
          <Table.Head id="description" label="Description" />
          <Table.Head id="products" label="Products" />
          <Table.Head id="created" label="Created" />
          <Table.Head id="status" label="Status" />
          <Table.Head id="actions" />
        </Table.Header>

        <Table.Body items={categories}>
          {(item) => (
            <Table.Row id={item.id}>
              <Table.Cell className="text-xs font-semibold text-quaternary">
                {item.id}
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm font-semibold text-primary">{item.name}</span>
              </Table.Cell>
              <Table.Cell>
                <p className="max-w-md truncate text-sm text-tertiary">{item.description}</p>
              </Table.Cell>
              <Table.Cell>
                {(() => {
                  const count = Array.isArray(item.products) ? item.products.length : 0;
                  return (
                    <Badge type="pill-color" color="gray" size="sm">
                      {count} product{count !== 1 ? "s" : ""}
                    </Badge>
                  );
                })()}
              </Table.Cell>
              <Table.Cell>
                {item.createdAt ? (
                  <span className="text-xs text-tertiary">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="text-quaternary">—</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <BadgeWithDot type="pill-color" color={item.status ? "success" : "error"} size="sm">
                  {item.status ? "Active" : "Inactive"}
                </BadgeWithDot>
              </Table.Cell>
              <Table.Cell>
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
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {categories.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-primary">No categories found</p>
          <p className="text-xs text-tertiary">Create a new category to get started.</p>
        </div>
      )}

      <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
        <span className="text-xs text-tertiary">
          Showing <span className="font-semibold text-primary">{categories.length}</span> {categories.length !== 1 ? "categories" : "category"}
        </span>
      </div>
    </TableCard.Root>
  );
};

export default CategoryTable;
