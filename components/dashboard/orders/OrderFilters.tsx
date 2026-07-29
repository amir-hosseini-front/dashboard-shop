"use client";

import { OrderStatus } from "@/types";
import { Search, Filter, X } from "lucide-react";

interface OrderFiltersProps {
  status: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "همه سفارشات" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل داده شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function OrderFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
  onReset,
}: OrderFiltersProps) {
  const hasFilters = status !== "" || search !== "";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        {/* جستجو */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="جستجوی سفارشات... (شماره سفارش، نام کاربر)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            dir="rtl"
          />
        </div>

        {/* فیلتر وضعیت */}
        <div className="relative min-w-[180px]">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white text-sm"
            dir="rtl"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* دکمه ریست */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            پاک کردن فیلترها
          </button>
        )}
      </div>

      {/* نمایش فیلترهای فعال */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
          {status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
              وضعیت: {statusOptions.find((s) => s.value === status)?.label}
              <button
                onClick={() => onStatusChange("")}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
              جستجو: {search}
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
