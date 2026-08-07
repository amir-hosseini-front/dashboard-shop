import { StatisticsData } from "@/types";
import StatsCards from "@/components/dashboard/StatsCards";
import PeriodStats from "@/components/dashboard/PeriodStats";
import SalesChart from "@/components/dashboard/SalesChart";
import OrderStatus from "@/components/dashboard/orders/OrderStatus";

// این تابع در سرور اجرا میشه و دیتا رو از API میگیره
async function getStatistics(): Promise<StatisticsData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/statistics`,
    {
      cache: "no-store", // برای دریافت داده‌های لحظه‌ای
      // یا از revalidation استفاده کنید:
      // next: { revalidate: 60 } // هر ۶۰ ثانیه یکبار
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return res.json();
}

export default async function StatisticsPage() {
  const stats = await getStatistics();

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 آمار و گزارشات</h1>
        <p className="text-gray-500 mt-1">نمایش کامل وضعیت فروش و سفارشات</p>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalProducts={stats.totalProducts}
        totalOrders={stats.totalOrders}
        totalUsers={stats.totalUsers}
        totalRevenue={stats.totalRevenue}
      />

      {/* Period Stats */}
      <PeriodStats
        todayOrders={stats.todayOrders}
        weekOrders={stats.weekOrders}
        monthOrders={stats.monthOrders}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={stats.monthlySales} />
        </div>
        <div className="lg:col-span-1">
          <OrderStatus statuses={stats.orderStatus} />
        </div>
      </div>
    </div>
  );
}
