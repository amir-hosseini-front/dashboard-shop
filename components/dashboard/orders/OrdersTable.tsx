"use client";

import { OrderWithUser } from "@/types";
import OrderStatusBadge from "./OrderStatusBadge";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersTableProps {
  orders: OrderWithUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onViewOrder: (order: OrderWithUser) => void;
  loading?: boolean;
}

export default function OrdersTable({
  orders,
  pagination,
  onPageChange,
  onViewOrder,
  loading = false,
}: OrdersTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg">هیچ سفارشی یافت نشد</p>
          <p className="text-gray-400 text-sm mt-1">
            سفارشی برای نمایش وجود ندارد
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* جدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-right p-4 text-sm font-medium text-gray-500">
                شماره سفارش
              </th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">
                مشتری
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-500">
                تاریخ
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-500">
                مبلغ
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-500">
                تعداد آیتم
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-500">
                وضعیت
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-500">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.user?.name || "نامشخص"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.user?.email || ""}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-center text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="p-4 text-center font-medium text-gray-900">
                  {formatPrice(order.total)}
                </td>
                <td className="p-4 text-center text-sm text-gray-600">
                  {order.items.length}
                </td>
                <td className="p-4 text-center">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="مشاهده جزئیات"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* صفحه‌بندی */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-sm text-gray-500">
            نمایش {(pagination.page - 1) * pagination.limit + 1} تا{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} از{" "}
            {pagination.total} سفارش
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
