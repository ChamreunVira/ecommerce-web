import { ReactNode } from "react";

export type Column<T> = {
  header: string;
  key: keyof T;
  render?: (value: T[keyof T], item: T) => ReactNode;
  className?: string;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export default function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-sm border border-gray-200 mt-4">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left font-medium text-gray-700 ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const value = item[column.key];

                  return (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-3 text-gray-600 ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(value, item)
                        : String(value)}
                    </td>
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
        </tbody>
      </table>
    </div>
  );
}
