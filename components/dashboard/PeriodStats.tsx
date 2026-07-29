"use client";

import { Calendar, Clock, TrendingUp } from "lucide-react";

interface PeriodStatsProps {
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
}

export default function PeriodStats({
  todayOrders,
  weekOrders,
  monthOrders,
}: PeriodStatsProps) {
  const periods = [
    {
      title: "سفارشات امروز",
      value: todayOrders,
      icon: Calendar,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "سفارشات این هفته",
      value: weekOrders,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "سفارشات این ماه",
      value: monthOrders,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {periods.map((period, index) => {
        const Icon = period.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`${period.bg} p-3 rounded-xl`}>
                <Icon className={`w-6 h-6 ${period.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{period.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {period.value.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
