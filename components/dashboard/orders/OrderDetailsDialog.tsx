"use client";

import { useState } from "react";
import { OrderWithUser, OrderStatus } from "@/types";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  X,
  User,
  Phone,
  Calendar,
  CreditCard,
  Package,
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Mail,
} from "lucide-react";

interface OrderDetailsDialogProps {
  order: OrderWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل داده شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState("");

  if (!order) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: "نقدی",
      card: "کارت بانکی",
      online: "پرداخت آنلاین",
    };
    return methods[method] || method;
  };

  const getPaymentStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      pending: "در انتظار",
      paid: "پرداخت شده",
      failed: "ناموفق",
    };
    return statuses[status] || status;
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* بک‌گراند */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* دیالوگ */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* هدر */}
          <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  جزئیات سفارش
                </h2>
                <OrderStatusBadge status={order.status} size="lg" />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* محتوا */}
          <div className="p-6 space-y-6">
            {/* اطلاعات اصلی */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">شماره سفارش</p>
                <p className="font-semibold text-gray-900 font-mono">
                  {order.id.slice(0, 10).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاریخ ثبت</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">مبلغ کل</p>
                <p className="font-semibold text-gray-900 text-lg text-blue-600">
                  {formatPrice(order.total)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تعداد آیتم</p>
                <p className="font-semibold text-gray-900">
                  {order.items.length} محصول
                </p>
              </div>
            </div>

            {/* اطلاعات کاربر */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                اطلاعات مشتری
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">نام:</span>
                  <span className="font-medium">
                    {order.user?.name || "نامشخص"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {order.user?.email || "ندارد"}
                  </span>
                </div>
                {order.user?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{order.user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* آدرس */}
            <div className="p-4 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                آدرس تحویل
              </h4>
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {order.user?.address || "آدرسی ثبت نشده است"}
                </p>
              </div>
            </div>

            {/* لیست محصولات */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                محصولات سفارش
              </h4>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right p-3 text-sm font-medium text-gray-500">
                        محصول
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-500">
                        تعداد
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-500">
                        قیمت واحد
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        جمع
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {item.product.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-center p-3">
                          {formatPrice(item.price)}
                        </td>
                        <td className="text-left p-3 font-medium">
                          {formatPrice(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={3} className="text-left p-3">
                        جمع کل
                      </td>
                      <td className="text-left p-3 text-blue-600">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* تغییر وضعیت */}
            <div className="p-4 border rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                تغییر وضعیت سفارش
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as OrderStatus)
                  }
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  dir="rtl"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || selectedStatus === order.status}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
                >
                  {isUpdating ? "در حال بروزرسانی..." : "تغییر وضعیت"}
                </button>
              </div>
              {order.notes && (
                <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                  📝 یادداشت: {order.notes}
                </p>
              )}
              {selectedStatus === order.status && (
                <p className="mt-2 text-sm text-amber-600">
                  ⚠️ وضعیت فعلی سفارش همین است
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
