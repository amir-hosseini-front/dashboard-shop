import { orders } from "@/lib/api/orders";
import { db } from "@/lib/api/statistics";
import {
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderWithUser,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  let orders = db.getOrders();

  if (status !== "") {
    orders = orders.filter((order) => {
      return order.status.includes(status);
    });
  }
  if (search.trim() !== "") {
    orders = orders.filter((order) => {
      const searchLower = search.toLowerCase().trim();

      const user = db.getUserById(order.userId);
      const userName = user?.name || "";
      const userEmail = user?.email || "";

      return (
        order.id?.toLowerCase().includes(searchLower) ||
        userName.toLowerCase().includes(searchLower) ||
        userEmail.toLowerCase().includes(searchLower) ||
        order.status?.toLowerCase().includes(searchLower)
      );
    });
  }
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

export async function POST(request: Request) {
  const body = await request.json();
  let nextId = 5;
  const { userId, items, status = "processing", total } = body;
  if (!userId || !items || items.length === 0) {
    return NextResponse.json(
      { message: "شناسه کاربر و لیست محصولات الزامی است" },
      { status: 400 },
    );
  }

  const newOrder: Order = {
    id: "ORDER-" + nextId++,
    userId: body.userId,
    total: body.total,
    status: "processing",
    createdAt: new Date(),
    items: items.map((item: CartItem) => {
      return {
        id: nextId++,
        orderId: "ORDER-" + nextId++,
        quantity: item.quantity,
        price: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
        product: db.getProductById(item.productId),
      };
    }),
  };

  orders.push(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}
