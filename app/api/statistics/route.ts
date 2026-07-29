import { NextResponse } from "next/server";
import { StatisticsData } from "@/types";
import { db } from "@/lib/api/statistics";

export async function GET() {
  try {
    // دریافت داده‌ها از دیتابیس
    const products = db.getProducts();
    const orders = db.getOrders();
    const usersCount = db.getUsersCount();

    // محاسبه آمار
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalUsers = usersCount;

    // محاسبه فروش کل
    const totalRevenue = orders.reduce(
      (sum: any, order: any) => sum + order.total,
      0,
    );

    // تاریخ امروز
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // شروع هفته (یکشنبه)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // شروع ماه
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    // محاسبه سفارشات امروز
    const todayOrders = db.getOrdersByDateRange(today, new Date()).length;

    // محاسبه سفارشات این هفته
    const weekOrders = db.getOrdersByDateRange(weekStart, new Date()).length;

    // محاسبه سفارشات این ماه
    const monthOrders = db.getOrdersByDateRange(monthStart, new Date()).length;

    // فروش ماهانه
    const monthlySales = db.getMonthlySales(today.getFullYear());

    // وضعیت سفارشات
    const orderStatus = db.getOrderStatus();

    const statistics: StatisticsData = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      todayOrders,
      weekOrders,
      monthOrders,
      monthlySales,
      orderStatus,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ error: "خطا در دریافت آمار" }, { status: 500 });
  }
}
