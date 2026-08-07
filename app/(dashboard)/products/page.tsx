"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductForm from "@/components/dashboard/product/ProductForm";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "@/lib/hooks/useProducts";
import { Column, CoreTable } from "@/components/ui/CoreTable";

export default function ProductsPage() {
  const { products, loading, error, addProduct, editProduct, removeProduct } =
    useProducts();
  const [modalState, setModalState] = useState<{
    open: boolean;
    product?: Product | null;
  }>({ open: false });
  const [submitting, setSubmitting] = useState(false);

  // تعریف ستون‌های جدول
  const columns: Column<Product>[] = [
    {
      key: "index",
      header: "#",
      render: (_, index) => <span>{index + 1}</span>,
      className: "w-12",
    },
    {
      key: "name",
      header: "نام محصول",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "price",
      header: "قیمت (تومان)",
      render: (item) => <span>{item.price.toLocaleString()}</span>,
    },
    {
      key: "stock",
      header: "موجودی",
      render: (item) => <span>{item.stock}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "موجود"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "عملیات",
      render: (item: Product) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors text-sm flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            ویرایش
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </button>
        </div>
      ),
    },
  ];

  const handleAddNew = () => setModalState({ open: true, product: null });
  const handleEdit = (product: Product) =>
    setModalState({ open: true, product });
  const handleCloseModal = () => setModalState({ open: false });

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    try {
      await removeProduct(id);
    } catch (err) {
      alert("خطا در حذف محصول");
      console.error(err);
    }
  };

  const handleSuccess = async () => {
    setSubmitting(true);
    try {
      setModalState({ open: false });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          افزودن محصول جدید
        </button>
      </div>

      {/* Table */}
      <CoreTable
        data={products}
        columns={columns}
        emptyMessage="هیچ محصولی یافت نشد"
      />

      {/* Modal */}
      {modalState.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalState.product ? "ویرایش محصول" : "افزودن محصول جدید"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                product={modalState.product || undefined}
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl text-gray-600">در حال بارگذاری...</div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl text-red-600">{message}</div>
    </div>
  );
}
