"use client";

import { createProduct, updateProduct } from "@/lib/api/products";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // وقتی product تغییر میکنه (برای ویرایش)، فرم رو پر کن
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || 0,
        stock: product.stock || 0,
      });
    } else {
      setFormData({
        name: "",
        price: 0,
        stock: 0,
      });
    }
  }, [product]);

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام محصول الزامی است";
    }

    if (formData.price < 0) {
      newErrors.price = "قیمت نمی‌تواند منفی باشد";
    }

    if (formData.stock < 0) {
      newErrors.stock = "موجودی نمی‌تواند منفی باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (product) {
        // ویرایش
        await updateProduct(product.id, formData);
      } else {
        // ایجاد جدید
        await createProduct(formData);
      }
      onSuccess();
    } catch (err) {
      alert("خطا در ذخیره محصول");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
    // پاک کردن خطای مربوط به این فیلد
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* نام محصول */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نام محصول <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="مثال: کیک چرمی"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* قیمت */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          قیمت (تومان) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.price ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="مثال: 45000"
          min="0"
          disabled={loading}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>

      {/* موجودی */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          موجودی <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.stock ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="مثال: 45"
          min="0"
          disabled={loading}
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
        )}
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              در حال ذخیره...
            </>
          ) : product ? (
            "ویرایش محصول"
          ) : (
            "افزودن محصول"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
