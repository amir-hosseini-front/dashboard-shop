import { db } from "@/lib/api/statistics";
import { OrderStatus, OrderWithUser } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const orders = db.getOrders();

  // اضافه کردن اطلاعات کاربر به هر سفارش
  const ordersWithUser = orders.map((order) => ({
    ...order,
    user: db.getUserById(order.userId),
  }));

  return NextResponse.json({
    orders: ordersWithUser,
    pagination: {
      total: orders.length,
      page: 1,
      limit: orders.length,
      totalPages: 1,
    },
  });
}
