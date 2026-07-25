"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table as AriaTable, TableCard } from "@/components/application/table/table";
import { cx } from "@/utils/cx";

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => (
  <div className={cx("overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary w-full overflow-x-auto", className)}>
    <table className="w-full text-left text-sm border-collapse">
      {children}
    </table>
  </div>
);

export interface TheadProps {
  children: ReactNode;
  className?: string;
}

export const Thead: React.FC<TheadProps> = ({ children, className = "" }) => (
  <thead className={cx("border-b border-secondary bg-secondary h-11", className)}>
    <tr>{children}</tr>
  </thead>
);

export interface THeadingProps {
  children: ReactNode;
  className?: string;
}

export const THeading: React.FC<THeadingProps> = ({ children, className = "" }) => (
  <th
    className={cx(
      "px-6 py-3 text-xs font-semibold text-quaternary uppercase tracking-wider whitespace-nowrap",
      className,
    )}
  >
    {children}
  </th>
);

export interface TBodyProps {
  children: ReactNode;
  className?: string;
}

export const TBody: React.FC<TBodyProps> = ({ children, className = "" }) => (
  <tbody className={cx("divide-y divide-secondary bg-primary", className)}>
    {children}
  </tbody>
);

export interface TCellProps {
  children: ReactNode;
  className?: string;
}

export const TCell: React.FC<TCellProps> = ({ children, className = "" }) => (
  <td
    className={cx(
      "px-6 py-4 text-sm text-tertiary align-middle",
      className,
    )}
  >
    {children}
  </td>
);

export type Column<T> = {
  header: string;
  key: keyof T | string;
  render?: (value: unknown, item: T) => ReactNode;
  className?: string;
  cellClassName?: string;
};

export type TablePagination = {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PaginationProps = TablePagination;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("ellipsis-1");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("ellipsis-2");

      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();
  const startRecord = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = totalElements === 0 ? 0 : Math.min(currentPage * pageSize, totalElements);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-secondary bg-primary px-6 py-3.5 sm:flex-row">
      <span className="text-sm text-tertiary">
        Showing <span className="font-semibold text-primary">{startRecord}</span> to{" "}
        <span className="font-semibold text-primary">{endRecord}</span> of{" "}
        <span className="font-semibold text-primary">{totalElements}</span> results
      </span>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-secondary bg-primary px-3 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm text-quaternary">
                  ...
                </span>
              );
            }
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cx(
                  "flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-semibold transition",
                  currentPage === p
                    ? "bg-secondary text-primary font-bold shadow-xs ring-1 ring-secondary"
                    : "text-tertiary hover:bg-secondary hover:text-primary"
                )}
                type="button"
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-secondary bg-primary px-3 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

type LegacyTableProps<T> = {
  option?: ReactNode;
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey?: keyof T | ((item: T, index: number) => string | number);
  pagination?: TablePagination;
};

export default function LegacyTable<T>({
  option,
  data,
  columns,
  className,
  emptyTitle = "No data found",
  emptyDescription = "Try changing the search or create a new record.",
  rowKey,
  pagination,
}: LegacyTableProps<T>) {
  return (
    <TableCard.Root className={cx("shadow-xs ring-1 ring-secondary bg-primary", className)}>
      {/* Option bar */}
      {option && (
        <div className="border-b border-secondary bg-primary px-6 py-4">
          {option}
        </div>
      )}

      {/* Main Untitled UI Table */}
      <AriaTable aria-label="Data Table">
        <AriaTable.Header>
          {columns.map((col) => (
            <AriaTable.Head
              key={String(col.key)}
              id={String(col.key)}
              label={col.header}
              className={col.className}
            />
          ))}
        </AriaTable.Header>

        <AriaTable.Body>
          {data.length > 0 ? (
            data.map((item, index) => (
              <AriaTable.Row
                key={getRowKey(item, index, rowKey)}
                className="transition-colors hover:bg-secondary"
              >
                {columns.map((col) => {
                  const value = item[col.key as keyof T];
                  return (
                    <AriaTable.Cell key={String(col.key)} className={col.cellClassName}>
                      {col.render
                        ? col.render(value, item)
                        : formatCellValue(value)}
                    </AriaTable.Cell>
                  );
                })}
              </AriaTable.Row>
            ))
          ) : (
            <AriaTable.Row key="empty">
              <AriaTable.Cell colSpan={columns.length} className="px-6 py-16 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-brand-secondary">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path d="M4 7h16M4 12h16M4 17h10" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {emptyTitle}
                  </p>
                  <p className="mt-1 text-xs text-tertiary">
                    {emptyDescription}
                  </p>
                </div>
              </AriaTable.Cell>
            </AriaTable.Row>
          )}
        </AriaTable.Body>
      </AriaTable>

      {/* Footer / Pagination */}
      {pagination ? (
        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalElements={pagination.totalElements}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      ) : (
        <div className="flex items-center justify-between border-t border-secondary bg-primary px-6 py-3.5">
          <span className="text-xs text-tertiary">
            Showing <span className="font-semibold text-primary">{data.length}</span> record{data.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </TableCard.Root>
  );
}

function getRowKey<T>(
  item: T,
  index: number,
  rowKey?: keyof T | ((item: T, index: number) => string | number),
) {
  if (typeof rowKey === "function") return rowKey(item, index);
  if (rowKey) {
    const v = item[rowKey];
    if (typeof v === "string" || typeof v === "number") return v;
  }
  return index;
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "")
    return <span className="text-quaternary">—</span>;
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

