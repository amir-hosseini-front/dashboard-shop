"use client";

import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

interface StatsCardsProps {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function StatsCards({
  totalProducts,
  totalOrders,
  totalUsers,
  totalRevenue,
}: StatsCardsProps) {
  const stats = [
    {
      title: "کل محصولات",
      value: totalProducts.toLocaleString("fa-IR"),
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "کل سفارشات",
      value: totalOrders.toLocaleString("fa-IR"),
      icon: ShoppingCart,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "کاربران ثبت‌نام شده",
      value: totalUsers.toLocaleString("fa-IR"),
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "فروش کل",
      value: new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
        maximumFractionDigits: 0,
      }).format(totalRevenue),
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div
              className={`mt-4 h-1 w-full bg-gradient-to-r ${stat.color} rounded-full opacity-20`}
            />
          </div>
        );
      })}
    </div>
  );
}
