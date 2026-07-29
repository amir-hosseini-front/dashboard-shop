"use client";

import { OrderStatus } from "@/types";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: any;
  }
> = {
  pending: {
    label: "در انتظار",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    icon: Clock,
  },
  processing: {
    label: "در حال پردازش",
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "ارسال شده",
    color: "text-purple-800",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "تحویل داده شده",
    color: "text-green-800",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "لغو شده",
    color: "text-red-800",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: XCircle,
  },
};

export default function OrderStatusBadge({
  status,
  size = "md",
  showLabel = true,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.color}
        ${config.borderColor}
        transition-all duration-200
        hover:scale-105
      `}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  );
}
