import { ReactNode } from "react";

interface Column<T> {
  header: ReactNode;
  accessor: keyof T | ((row: T, index: number) => ReactNode);
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "데이터가 없습니다.",
}: Props<T>) {
  const renderCell = (row: T, col: Column<T>, index: number) =>
    typeof col.accessor === "function" ? col.accessor(row, index) : String(row[col.accessor]);

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="table w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`${col.className || "text-center"} text-sm font-semibold text-gray-700 border-b border-gray-200`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-gray-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={keyExtractor(row)}
                className={`hover:bg-gray-50 transition-colors ${
                  rowIdx !== data.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`${col.className || "text-center"} text-sm text-gray-900 py-4`}>
                    {renderCell(row, col, rowIdx)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
