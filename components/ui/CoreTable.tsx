"use client";

import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

interface CoreTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: string;
}

export function CoreTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "داده‌ای وجود ندارد",
  onRowClick,
  rowClassName = "hover:bg-gray-50 transition-colors",
}: CoreTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                className={rowClassName}
                onClick={() => onRowClick?.(item)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border-b border-gray-100 px-4 py-3 text-sm text-gray-600 ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(item, index)
                      : (item[col.key] ?? "-")}
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
