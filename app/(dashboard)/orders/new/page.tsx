"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NewOrderForm from "@/components/dashboard/orders/NewOrderForm";

export default function NewOrderPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ➕ ثبت سفارش جدید
            </h1>
            <p className="text-gray-500 mt-1">
              مشتری، محصولات و جزئیات سفارش را وارد کنید
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <NewOrderForm onSuccess={() => router.push("/orders")} />
      </div>
    </div>
  );
}
