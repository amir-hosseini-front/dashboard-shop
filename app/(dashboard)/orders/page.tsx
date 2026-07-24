"use client";

import { fetchOrders } from "@/lib/api/orders";
import { useEffect, useState } from "react";
interface Order {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersFiltered, setOrdersFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("همه سفارشات");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchOrders();
      setOrders(data);
      setOrdersFiltered(data);
    } catch (err) {
      setError("خطا در دریافت محصولات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value);
    setOrdersFiltered(filterOrders(event.target.value));
  };

  const filterOrders = (value: string) => {
    if (value === "همه سفارشات") {
      return orders;
    } else {
      return orders.filter((order: Order) => order.status === value);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "پرداخت شده":
        return "bg-green-100 text-green-800";
      case "در انتظار":
        return "bg-yellow-100 text-yellow-800";
      case "لغو شده":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🛒 مدیریت سفارشات</h1>
        <div className="flex gap-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="همه سفارشات">همه سفارشات</option>
            <option value="پرداخت شده">پرداخت شده</option>
            <option value="در انتظار">در انتظار</option>
            <option value="لغو شده">لغو شده</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 text-sm font-semibold">شناسه</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">مشتری</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">مبلغ</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">وضعیت</th>
              <th className="p-4 text-gray-600 text-sm font-semibold">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {ordersFiltered.map((order, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4 text-gray-800 font-medium">{order.id}</td>
                <td className="p-4 text-gray-800">{order.customer}</td>
                <td className="p-4 text-gray-800 font-medium">
                  {order.amount}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
