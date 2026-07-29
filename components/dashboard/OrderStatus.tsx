"use client";

import { PieChart, Clock, Truck, CheckCircle, Package } from "lucide-react";

interface OrderStatusProps {
  statuses: { status: string; count: number; color: string }[];
}

export default function OrderStatus({ statuses }: OrderStatusProps) {
  const getIcon = (status: string) => {
    switch (status) {
      case "در انتظار":
        return Clock;
      case "در حال پردازش":
        return Package;
      case "ارسال شده":
        return Truck;
      case "تحویل داده شده":
        return CheckCircle;
      default:
        return PieChart;
    }
  };

  const total = statuses.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">وضعیت سفارشات</h3>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
          <PieChart className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {total.toLocaleString("fa-IR")} سفارش
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {statuses.map((item, index) => {
          const Icon = getIcon(item.status);
          const percentage = total > 0 ? (item.count / total) * 100 : 0;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    {item.status}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {item.count.toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
