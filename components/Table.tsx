import { ReactNode } from "react";

// Wrapper Table & Table Component
interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`overflow-x-auto ${className}`}
    >
      <table className="min-w-full text-left text-sm">{children}</table>
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
    <thead className={`sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
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
      className={`whitespace-nowrap border-b border-slate-200 px-5 py-3 ${className}`}
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
  return <td className={`border-b border-slate-100 px-5 py-4 align-middle text-slate-600 ${className}`}>{children}</td>;
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
};

export default function LegacyTable<T>({ data, columns }: LegacyTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
              <tr key={index} className="transition hover:bg-orange-50/40">
                {columns.map((column) => {
                  const value = item[column.key as keyof T];

                  return (
                    <TCell key={String(column.key)} className={column.cellClassName}>
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
                className="px-5 py-12 text-center text-sm text-slate-500"
              >
                <div className="mx-auto max-w-sm">
                  <p className="font-medium text-slate-700">No data found</p>
                  <p className="mt-1 text-slate-500">Try changing the search or create a new record.</p>
                </div>
              </td>
            </tr>
          )}
        </TBody>
      </Table>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-500">
        <span>Total records</span>
        <span className="font-semibold text-slate-800">{data.length}</span>
      </div>
    </div>
  );
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
