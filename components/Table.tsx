import { ReactNode } from "react";

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

// Wrapper Table & Table Component
interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
        {children}
      </table>
    </div>
  );
};


// Table Head Components
interface TheadProps {
  children: ReactNode;
  className?: string;
}

export const Thead: React.FC<TheadProps> = ({ children, className = "" }) => {
  return (
    <thead
      className={cn("sticky top-0 z-99 bg-white text-lg tracking-normal text-slate-500",className)}
    >
      <tr>{children}</tr>
    </thead>
  );
};


// Table Heading, Body, Cell Components
interface THeadingProps {
  children: ReactNode;
  className?: string;
}

export const THeading: React.FC<THeadingProps> = ({
  children,
  className = "",
}) => {
  return (
    <th
      className={cn(
        "font-semibold text-sm whitespace-nowrap border-b border-slate-200 bg-white px-4 py-5 text-left align-middle first:pl-5 last:pr-5",
        className
      )}
    >
      {children}
    </th>
  );
};


// Table Body & Cell Components
interface TBodyProps {
  children: ReactNode;
  className?: string;
}

export const TBody: React.FC<TBodyProps> = ({ children, className = "" }) => {
  return <tbody className={className}>{children}</tbody>;
};

// Table Cell Component
interface TCellProps {
  children: ReactNode;
  className?: string;
}

export const TCell: React.FC<TCellProps> = ({ children, className = "" }) => {
  return (
    <td
      className={cn(
        "border-b border-slate-100 bg-white px-4 py-3.5 align-middle text-slate-600 first:pl-5 last:pr-5",
        className
      )}
    >
      {children}
    </td>
  );
};

// Column Type for Dynamic Table
export type Column<T> = {
  header: string;
  key: keyof T | string;
  render?: (value: unknown, item: T) => ReactNode;
  className?: string;
  cellClassName?: string;
};


// Main Table Component Dynamic for map data and column
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
        className
      )}
    >
      <Table className="max-h-[calc(100vh-280px)]">
        <Thead>
          {columns.map((column) => (
            <THeading key={String(column.key)} className={column.className}>
              {column.header}
            </THeading>
          ))}
        </Thead>

        <TBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={getRowKey(item, index, rowKey)}
                className="group transition-colors"
              >
                {columns.map((column) => {
                  const value = item[column.key as keyof T];

                  return (
                    <TCell
                      key={String(column.key)}
                      className={cn(column.cellClassName)}>
                      {column.render ? column.render(value, item) : formatCellValue(value)}
                    </TCell>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="bg-white px-5 py-14 text-center text-sm text-slate-500"
              >
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-500">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path d="M4 7h16" />
                      <path d="M4 12h16" />
                      <path d="M4 17h10" />
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-800">{emptyTitle}</p>
                  <p className="mt-1 text-slate-500">{emptyDescription}</p>
                </div>
              </td>
            </tr>
          )}
        </TBody>
      </Table>
      <div className="flex items-center justify-between bg-white px-5 py-3 text-sm text-slate-600">
        <span className="font-medium">Total records</span>
        <span className="rounded-md border border-orange-100 bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
          {data.length}
        </span>
      </div>
    </div>
  );
}

function getRowKey<T>(
  item: T,
  index: number,
  rowKey?: keyof T | ((item: T, index: number) => string | number)
) {
  if (typeof rowKey === "function") {
    return rowKey(item, index);
  }

  if (rowKey) {
    const value = item[rowKey];
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }

  return index;
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">-</span>;
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}
