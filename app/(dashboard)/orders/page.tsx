"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderWithUser, OrderStatus, OrdersResponse } from "@/types";
import OrdersTable from "@/components/dashboard/orders/OrdersTable";
import OrderFilters from "@/components/dashboard/orders/OrderFilters";
import OrderDetailsDialog from "@/components/dashboard/orders/OrderDetailsDialog";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/lib/hooks/useOrders";
const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 10, totalPages: 1 };

export default function OrdersPage() {
  const {
    orders,
    loading,
    error,
    dialogOpen,
    pagination,
    selectedOrder,
    filters,
    addOrder,
    loadOrders,
    handlePageChange,
    handleStatusChange,
    handleFilterChange,
    handleViewOrder,
    handleDialogOpen,
    resetFilters,
  } = useOrders();
  const router = useRouter();

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📦 مدیریت سفارشات
          </h1>
          <p className="text-gray-500 mt-1">
            مشاهده، جستجو و مدیریت تمام سفارشات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            بروزرسانی
          </button>
          <button
            onClick={() => router.push("/orders/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            سفارش جدید
          </button>
        </div>
      </div>

      <OrderFilters
        status={filters.status}
        search={filters.search}
        onStatusChange={(value) => handleFilterChange("status", value)}
        onSearchChange={(value) => handleFilterChange("search", value)}
        onReset={resetFilters}
      />

      {/* ===== جدول سفارشات ===== */}
      <OrdersTable
        orders={orders}
        pagination={pagination}
        onPageChange={handlePageChange}
        onViewOrder={handleViewOrder}
        loading={loading}
      />

      {/* ===== دیالوگ جزئیات سفارش ===== */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={dialogOpen}
        onClose={() => handleDialogOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
