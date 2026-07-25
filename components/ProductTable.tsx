"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";
import Table, { Column } from "./Table";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

interface ProductTableProps {
  products: Product[];
  handleDelete: (id: number) => void;
  handleUpdate?: (product: Product) => void;
  option?: React.ReactNode;
}

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleDelete,
  handleUpdate,
  option,
}) => {
  const columns: Column<Product>[] = [
    {
      header: "Product",
      key: "name",
      render: (_, product) => {
        const img = product.images?.[0];
        return (
          <div className="flex items-center gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-secondary bg-tertiary">
              {img ? (
                <Image
                  src={`${BASE_IMG}/${img}`}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-quaternary font-medium">
                  IMG
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="max-w-48 truncate text-sm font-semibold text-primary">
                {product.name}
              </p>
              <p className="mt-0.5 max-w-48 truncate text-xs text-tertiary">
                {product.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      key: "categoryName",
      render: (value) => (
        <Badge type="pill-color" color="gray" size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (value) => (
        <span className="text-sm font-semibold text-primary font-mono">
          ${Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Discount",
      key: "discount",
      render: (value) => {
        const disc = Number(value);
        return disc > 0 ? (
          <Badge type="pill-color" color="error" size="sm">
            -{disc}%
          </Badge>
        ) : (
          <span className="text-quaternary">—</span>
        );
      },
    },
    {
      header: "Stock",
      key: "qty",
      render: (value) => {
        const qty = Number(value);
        const color = qty <= 0 ? "error" : qty < 10 ? "warning" : "success";
        return (
          <BadgeWithDot type="pill-color" color={color} size="sm">
            {qty <= 0 ? "Out of stock" : `${qty} in stock`}
          </BadgeWithDot>
        );
      },
    },
    {
      header: "Updated",
      key: "updatedAt",
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
      header: "Action",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleUpdate?.(item)}
            className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
            aria-label="Edit product"
          >
            <Edit01 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(Number(item.id))}
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
      ),
    },
  ];

  return (
    <Table data={products} columns={columns} rowKey="id" option={option} />
  );
};

export default ProductTable;