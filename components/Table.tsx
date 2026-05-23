import { ReactNode } from "react";

// Table Component
interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`overflow-x-auto rounded-sm mt-4 ${className}`}
    >
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
};

interface TheadProps {
  children: ReactNode;
  className?: string;
}

export const Thead: React.FC<TheadProps> = ({ children, className = "" }) => {
  return (
    <thead className={`font-semibold text-base ${className}`}>
      <tr>{children}</tr>
    </thead>
  );
};


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
      className={`px-4 py-3 text-left font-medium text-gray-700 ${className}`}
    >
      {children}
    </th>
  );
};

interface TBodyProps {
  children: ReactNode;
  className?: string;
}

export const TBody: React.FC<TBodyProps> = ({ children, className = "" }) => {
  return <tbody className={className}>{children}</tbody>;
};

interface TCellProps {
  children: ReactNode;
  className?: string;
}

export const TCell: React.FC<TCellProps> = ({ children, className = "" }) => {
  return <td className={`px-4 py-3 text-gray-600 ${className}`}>{children}</td>;
};

export type Column<T> = {
  header: string;
  key: keyof T;
  render?: (value: T[keyof T], item: T) => ReactNode;
  className?: string;
};

type LegacyTableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export default function LegacyTable<T>({ data, columns }: LegacyTableProps<T>) {
  return (
    <Table>
      <Thead>
        {columns.map((column) => (
          <THeading key={String(column.key)} className={`border-b border-slate-100 ${column.className}`}>
            {column.header}
          </THeading>
        ))}
      </Thead>

      <TBody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <tr key={index} className="even:bg-zinc-50">
              {columns.map((column, colIndex) => {
                const value = item[column.key];

                return (
                  <TCell key={String(column.key)} className={`text-base ${column.className}`}>
                    {column.render ? column.render(value, item) : String(value)}
                  </TCell>
                );
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="py-6 text-center text-gray-500"
            >
              No data found
            </td>
          </tr>
        )}
      </TBody>
    </Table>
  );
}
