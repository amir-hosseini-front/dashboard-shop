import { Order } from "@/types";
import { products } from "./products";

const API_BASE = "/api";
export let orders: Order[] = [
  // سفارش ۱ - علی
  {
    id: "order-1",
    userId: "user-1",
    total: 134000,
    status: "delivered",
    createdAt: new Date("2026-07-20"),
    items: [
      {
        id: "item-1",
        orderId: "order-1",
        product: products[0], // کیک چرمی
        quantity: 2,
        price: 45000,
        subtotal: 90000,
      },
      {
        id: "item-2",
        orderId: "order-1",
        product: products[3], // کمربند چرمی
        quantity: 1,
        price: 35000,
        subtotal: 35000,
      },
    ],
  },
  // سفارش ۲ - مریم
  {
    id: "order-2",
    userId: "user-2",
    total: 89000,
    status: "shipped",
    createdAt: new Date("2026-07-22"),
    items: [
      {
        id: "item-3",
        orderId: "order-2",
        product: products[1], // کیف چرمی
        quantity: 1,
        price: 89000,
        subtotal: 89000,
      },
    ],
  },
  {
    id: "order-3",
    userId: "user-3",
    total: 235000,
    status: "pending",
    createdAt: new Date("2026-07-23"),
    items: [
      {
        id: "item-4",
        orderId: "order-3",
        product: products[0], // کیک چرمی
        quantity: 3,
        price: 45000,
        subtotal: 135000,
      },
      {
        id: "item-5",
        orderId: "order-3",
        product: products[2], // دستکش چرمی
        quantity: 2,
        price: 55000,
        subtotal: 110000,
      },
    ],
  },
  // سفارش ۴ - علی
  {
    id: "order-4",
    userId: "user-1",
    total: 120000,
    status: "processing",
    createdAt: new Date("2026-07-24"),
    items: [
      {
        id: "item-6",
        orderId: "order-4",
        product: products[2], // کفش چرمی
        quantity: 1,
        price: 120000,
        subtotal: 120000,
      },
    ],
  },
  // سفارش ۵ - مریم
  {
    id: "order-5",
    userId: "user-2",
    total: 134000,
    status: "cancelled",
    createdAt: new Date("2026-07-21"),
    items: [
      {
        id: "item-7",
        orderId: "order-5",
        product: products[0], // کیک چرمی
        quantity: 2,
        price: 45000,
        subtotal: 90000,
      },
      {
        id: "item-8",
        orderId: "order-5",
        product: products[3], // کمربند چرمی
        quantity: 1,
        price: 35000,
        subtotal: 35000,
      },
    ],
  },
];

export async function fetchOrders() {
  const res = await fetch(`/api/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("خطا در دریافت محصولات");
  return res.json();
}
