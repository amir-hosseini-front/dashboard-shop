import { Product, Order } from "@/types";
import { products } from "./products";
import { orders } from "./orders";

const users = Array.from({ length: 5420 }, (_, i) => ({ id: `user${i + 1}` }));

export const db = {
  getProducts: () => products,

  getOrders: () => orders,

  getUsersCount: () => users.length,
  getUserById: (id: string) => users.find((u) => u.id === id),
  getOrdersByDateRange: (startDate: Date, endDate: Date) => {
    return orders.filter(
      (order: Order) =>
        order.createdAt >= startDate && order.createdAt <= endDate,
    );
  },

  getMonthlySales: (year: number) => {
    const months = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    return months.map((month, index) => {
      const monthOrders = orders.filter(
        (order) =>
          order.createdAt.getFullYear() === year &&
          order.createdAt.getMonth() === index,
      );

      const total = monthOrders.reduce((sum, order) => sum + order.total, 0);

      return { month, amount: total };
    });
  },

  getOrderStatus: () => {
    const statusMap = {
      pending: { status: "در انتظار", color: "#f59e0b" },
      processing: { status: "در حال پردازش", color: "#3b82f6" },
      shipped: { status: "ارسال شده", color: "#8b5cf6" },
      delivered: { status: "تحویل داده شده", color: "#10b981" },
    };

    const result = Object.entries(statusMap).map(([key, value]) => {
      const count = orders.filter((order) => order.status === key).length;
      return { ...value, count };
    });

    return result;
  },
};
