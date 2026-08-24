"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}
type FormData = {
  name: string;
  price: number;
  stock: number;
};
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
  const { addProduct, editProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: product?.name,
      price: product?.price,
      stock: product?.stock,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (product) {
        await editProduct(product.id, data);
      } else {
        await addProduct(data);
      }
      onSuccess();
    } catch (err) {
      alert("خطا در ذخیره محصول");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setLoading(true);
  //   setErrors({});

  //   try {
  //     if (product) {
  //       await updateProduct(product.id, formData);
  //     } else {
  //       await createProduct(formData);
  //     }
  //     onSuccess();
  //   } catch (err) {
  //     alert("خطا در ذخیره محصول");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نام محصول <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name", { required: " نام محصول الزامی است " })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="مثال: کیک چرمی"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          قیمت (تومان) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("price", {
            required: "قیمت نمی تواند صفر باشد",
          })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.price ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="مثال: 45000"
          min="0"
          disabled={loading}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          موجودی <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("stock", {
            required: "موجودی نمی‌تواند منفی باشد",
          })}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.stock ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="مثال: 45"
          min="0"
          disabled={loading}
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
        )}
      </div>

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
