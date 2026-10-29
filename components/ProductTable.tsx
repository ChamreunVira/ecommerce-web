"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-url";
import { Table, TableCard } from "@/components/application/table/table";
import { Product } from "@/types/product";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface ProductTableProps {
  products: Product[];
  handleDelete: (id: number) => void | Promise<void>;
  handleUpdate?: (product: Product) => void;
  option?: React.ReactNode;
}


const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleDelete,
  handleUpdate,
  option,
}) => {
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await handleDelete(Number(deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableCard.Root>
      {option && (
        <div className="border-b border-secondary bg-primary px-6 py-4">
          {option}
        </div>
      )}

      <Table aria-label="Products table">
        <Table.Header>
          <Table.Head id="name" label="Product" isRowHeader allowsSorting />
          <Table.Head id="category" label="Category" allowsSorting />
          <Table.Head id="price" label="Price" allowsSorting />
          <Table.Head id="discount" label="Discount" />
          <Table.Head id="stock" label="Stock" allowsSorting />
          <Table.Head id="updated" label="Updated" allowsSorting />
          <Table.Head id="actions" />
        </Table.Header>

        <Table.Body items={products}>
          {(product) => {
            const img = product.images?.[0];
            const qty = Number(product.qty);
            const stockColor = qty <= 0 ? "error" : qty < 10 ? "warning" : "success";
            const disc = Number(product.discount);

            return (
              <Table.Row id={product.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-secondary bg-tertiary">
                      {img ? (
                        <Image
                          src={getImageUrl(img)}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-quaternary">
                          IMG
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-48 truncate text-sm font-semibold text-primary">{product.name}</p>
                      <p className="mt-0.5 max-w-48 truncate text-xs text-tertiary">{product.description}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge type="pill-color" color="gray" size="sm">
                    {product.categoryName}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-mono text-sm font-semibold text-primary">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {disc > 0 ? (
                    <Badge type="pill-color" color="error" size="sm">
                      -{disc}%
                    </Badge>
                  ) : (
                    <span className="text-quaternary">—</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <BadgeWithDot type="pill-color" color={stockColor} size="sm">
                    {qty <= 0 ? "Out of stock" : `${qty} in stock`}
                  </BadgeWithDot>
                </Table.Cell>
                <Table.Cell>
                  {product.updatedAt ? (
                    <span className="text-xs text-tertiary">
                      {new Date(product.updatedAt).toLocaleDateString("en-US", {
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
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdate?.(product)}
                      className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                      aria-label="Edit product"
                    >
                      <Edit01 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary"
                      aria-label="Delete product"
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
            );
          }}
        </Table.Body>
      </Table>

      {products.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-primary">No products found</p>
          <p className="text-xs text-tertiary">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
        <span className="text-xs text-tertiary">
          Showing <span className="font-semibold text-primary">{products.length}</span> {products.length !== 1 ? "products" : "product"}
        </span>
      </div>

      {deleteTarget && (
        <DeleteConfirmationModal
          title="Delete product"
          message={<>Are you sure you want to delete <span className="font-semibold text-primary">{deleteTarget.name}</span>? This action cannot be undone.</>}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </TableCard.Root>
  );
};

export default ProductTable;
