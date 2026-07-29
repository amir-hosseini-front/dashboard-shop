"use client";

import { useState, useEffect } from "react";
import { OrderWithUser, OrderStatus, OrdersResponse } from "@/types";
import OrdersTable from "@/components/dashboard/orders/OrdersTable";
import OrderFilters from "@/components/dashboard/orders/OrderFilters";
import OrderDetailsDialog from "@/components/dashboard/orders/OrderDetailsDialog";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/orders?${params}`);

      if (!res.ok) {
        throw new Error("خطا در دریافت سفارشات");
      }

      const data: OrdersResponse = await res.json();

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter, searchQuery]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewOrder = (order: OrderWithUser) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // رفرش لیست
      await fetchOrders();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("خطا در تغییر وضعیت سفارش");
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    fetchOrders();
  };

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
            onClick={handleRefresh}
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
        status={statusFilter}
        search={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        onReset={handleResetFilters}
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
        onClose={() => setDialogOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
