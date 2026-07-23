"use client";

import ProductForm from "@/components/ProductForm";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/api";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}
interface ProductFormData {
  name: string;
  price: number;
  stock: number;
}
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    stock: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("خطا در دریافت محصولات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: 0, stock: 0 });
    setShowModal(true);
  };
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: "", price: 0, stock: 0 });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("نام محصول الزامی است");
      return;
    }
    if (formData.price < 0) {
      alert("قیمت نمی‌تواند منفی باشد");
      return;
    }
    if (formData.stock < 0) {
      alert("موجودی نمی‌تواند منفی باشد");
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }

      await loadProducts();
      handleCloseModal();
    } catch (err) {
      alert("خطا در ذخیره محصول");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      alert("خطا در حذف محصول");
      console.error(err);
    }
  };

  const handleSuccess = async () => {
    await loadProducts();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span>
          افزودن محصول جدید
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                #
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                نام محصول
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                قیمت (تومان)
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                موجودی
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                وضعیت
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  هیچ محصولی یافت نشد
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-800 font-medium">
                    {product.name}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {product.price.toLocaleString()}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {product.stock}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "موجود"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors text-sm"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
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
                product={editingProduct}
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
