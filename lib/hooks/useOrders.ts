// hooks/useProducts.ts
import { useState, useEffect, useCallback } from "react";
import { OrdersResponse, OrderStatus, OrderWithUser } from "@/types";
import { fetchOrders, createOrder } from "@/lib/api/orders";

const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 10, totalPages: 1 };
interface ProductFormData {
  name: string;
  price: number;
  stock: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(
    null,
  );

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error("خطا در دریافت سفارشات");

      const data: OrdersResponse = await res.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const addOrder = async (data: ProductFormData) => {
    await createOrder(data);
  };
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const resetFilters = () => {
    setFilters({ status: "", search: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
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

      await fetchOrders();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("خطا در تغییر وضعیت سفارش");
    }
  };

  const handleViewOrder = (order: OrderWithUser) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  const handleDialogOpen = (value: boolean) => {
    setDialogOpen(value);
  };
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    dialogOpen,
    filters,
    pagination,
    selectedOrder,
    loadOrders,
    addOrder,
    handlePageChange,
    handleStatusChange,
    handleFilterChange,
    handleViewOrder,
    handleDialogOpen,
    resetFilters,
  };
}
