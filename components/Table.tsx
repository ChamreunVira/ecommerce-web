import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}


interface TableProps {
  children: ReactNode;
  className?: string;
}
export const Table: React.FC<TableProps> = ({ children, className = "" }) => (
  <div className={cn("w-full overflow-x-auto overscroll-x-contain", className)}>
    <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
      {children}
    </table>
  </div>
);

interface TheadProps {
  children: ReactNode;
  className?: string;
}
export const Thead: React.FC<TheadProps> = ({ children, className = "" }) => (
  <thead className={cn("bg-slate-50 text-xs text-slate-500 dark:bg-slate-900/70 dark:text-slate-400", className)}>
    <tr>{children}</tr>
  </thead>
);

interface THeadingProps {
  children: ReactNode;
  className?: string;
}
export const THeading: React.FC<THeadingProps> = ({
  children,
  className = "",
}) => (
  <th
    className={cn(
      "whitespace-nowrap border-b border-slate-200 px-5 py-3 text-left text-xs font-medium first:pl-6 last:pr-6 dark:border-slate-800",
      className,
    )}
  >
    {children}
  </th>
);

interface TBodyProps {
  children: ReactNode;
  className?: string;
}
export const TBody: React.FC<TBodyProps> = ({ children, className = "" }) => (
  <tbody className={cn("divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950", className)}>{children}</tbody>
);

interface TCellProps {
  children: ReactNode;
  className?: string;
}
export const TCell: React.FC<TCellProps> = ({ children, className = "" }) => (
  <td
    className={cn(
      "border-b-0 px-5 py-4 align-middle text-sm text-slate-700 first:pl-6 last:pr-6 dark:text-slate-300",
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
    <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 px-5 py-3.5 sm:flex-row sm:px-6">
      <span className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{startRecord}</span> to{" "}
        <span className="font-semibold text-slate-700">{endRecord}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalElements}</span> records
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          type="button"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) => {
          if (typeof p === "string") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 leading-none">
                ...
              </span>
            );
          }
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-lg border px-2.5 text-xs font-semibold shadow-sm transition-colors",
                currentPage === p
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
              type="button"
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          type="button"
          aria-label="Next page"
        >
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
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02] dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >

      {/* top search & filtering */}
      {option && (<div>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          {option}
        </div>
      </div>)}

      {/* table */}
      <Table>
        <Thead>
          {columns.map((col) => (
            <THeading key={String(col.key)} className={col.className}>
              {col.header}
            </THeading>
          ))}
        </Thead>


        {/* dynamic data pasted from parent */}
        <TBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={getRowKey(item, index, rowKey)}
                className="transition-colors duration-150 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
              >

                {/* map data from parent */}
                {columns.map((col) => {
                  const value = item[col.key as keyof T];
                  return (
                    <TCell key={String(col.key)} className={col.cellClassName}>
                      {col.render
                        ? col.render(value, item)
                        : formatCellValue(value)}
                    </TCell>
                  );
                })}

              </tr>
            ))
          ) : (
            // if no data it's will show this content
            <tr>
              <td colSpan={columns.length} className="px-5 py-16 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500">
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
                  <p className="text-sm font-semibold text-slate-800">
                    {emptyTitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {emptyDescription}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </TBody>
      </Table>

     {/* footer */}
      {pagination ? (
        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalElements={pagination.totalElements}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      ) : (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <span className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{data.length}</span>{" "}
            record{data.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
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

// like empty field show like this '-'
function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "")
    return <span className="text-slate-400">—</span>;
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
