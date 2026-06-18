import { ReactNode } from "react";

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}


interface TableProps {
  children: ReactNode;
  className?: string;
}
export const Table: React.FC<TableProps> = ({ children, className = "" }) => (
  <div className={cn("overflow-x-auto", className)}>
    <table className="w-full min-w-180 border-separate border-spacing-0 text-left">
      {children}
    </table>
  </div>
);

interface TheadProps {
  children: ReactNode;
  className?: string;
}
export const Thead: React.FC<TheadProps> = ({ children, className = "" }) => (
  <thead className={cn("bg-gray-100/80", className)}>
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
      "whitespace-nowrap font-medium border-b border-slate-200 p-4 text-base text-slate-900 first:pl-12 last:pr-12",
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
  <tbody className={className}>{children}</tbody>
);

interface TCellProps {
  children: ReactNode;
  className?: string;
}
export const TCell: React.FC<TCellProps> = ({ children, className = "" }) => (
  <td
    className={cn(
      "border-b border-slate-100 p-4 align-middle text-sm text-slate-700 first:pl-12 last:pr-12",
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

type LegacyTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey?: keyof T | ((item: T, index: number) => string | number);
};

export default function LegacyTable<T>({
  data,
  columns,
  className,
  emptyTitle = "No data found",
  emptyDescription = "Try changing the search or create a new record.",
  rowKey,
}: LegacyTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-slate-200 bg-white",
        className,
      )}
    >
      <Table>
        <Thead>
          {columns.map((col) => (
            <THeading key={String(col.key)} className={col.className}>
              {col.header}
            </THeading>
          ))}
        </Thead>

        <TBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={getRowKey(item, index, rowKey)}
                className="transition-colors hover:bg-slate-50/60"
              >
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
            <tr>
              <td colSpan={columns.length} className="px-5 py-16 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-orange-500">
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
      <div className="flex items-center justify-between bg-white px-5 py-3">
        <span className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">{data.length}</span>{" "}
          record{data.length !== 1 ? "s" : ""}
        </span>
      </div>
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

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "")
    return <span className="text-slate-400">—</span>;
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
