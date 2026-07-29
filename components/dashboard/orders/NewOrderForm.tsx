"use client";

import { useState, useEffect, useMemo } from "react";
import { Trash2, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

// تایپ های فرضی برای داده‌ها
type UserOption = { id: string; name: string; email: string };
type ProductOption = { id: string; name: string; price: number; stock: number };

// آیتم‌های داخل سبد خرید
interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function NewOrderForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- استیت‌های فرم ---
  const [selectedUserId, setSelectedUserId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNote, setOrderNote] = useState("");
  const [orderStatus, setOrderStatus] = useState("PENDING");

  // --- استیت‌های جستجوی کاربر و محصول ---
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // --- دکمه محاسبه مبلغ کل ---
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  // --- 1. فراخوانی API برای دریافت کاربران (Debounce شده) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (userSearch.length > 1) {
        setIsLoadingUsers(true);
        try {
          const res = await fetch(`/api/users?search=${userSearch}&limit=5`);
          const data = await res.json();
          setUsers(data || []);
        } catch (error) {
          console.error("Error fetching users", error);
        } finally {
          setIsLoadingUsers(false);
        }
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearch]);

  // --- 2. فراخوانی API برای دریافت محصولات (برای جستجو در مودال افزودن) ---
  const searchProducts = async (query: string) => {
    if (query.length < 1) return;
    setIsLoadingProducts(true);
    try {
      const res = await fetch(`/api/products?search=${query}&limit=10`);
      const data = await res.json();
      setProducts(data || []);
      console.log(products);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // --- 3. افزودن محصول به سبد ---
  const addToCart = (product: ProductOption) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id);
      if (existingItem) {
        // اگر محصول وجود داشت، تعداد را +1 کن
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice,
              }
            : item,
        );
      }
      // اگر جدید بود اضافه کن
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          totalPrice: product.price,
        },
      ];
    });
    setProductSearch("");
    setProducts([]);
    setShowProductDropdown(false);
  };

  // --- 4. حذف محصول از سبد ---
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // --- 5. تغییر تعداد محصول ---
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice,
            }
          : item,
      ),
    );
  };

  // --- 6. ثبت نهایی سفارش (Submit) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return alert("لطفا مشتری را انتخاب کنید");
    if (cartItems.length === 0) return alert("سبد خرید خالی است");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          total: totalAmount,
          items: cartItems.map(({ productId, quantity, unitPrice }) => ({
            productId,
            quantity,
            unitPrice,
          })),
        }),
      });

      if (!response.ok) throw new Error("خطا در ثبت سفارش");

      alert("سفارش با موفقیت ثبت شد!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("مشکلی در ثبت سفارش پیش آمد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- بخش اول: اطلاعات مشتری --- */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          انتخاب مشتری <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="جستجو و انتخاب مشتری (نام یا ایمیل)..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isLoadingUsers && (
            <span className="absolute left-3 top-3 text-xs text-gray-400">
              در حال جستجو...
            </span>
          )}

          {/* لیست کشویی کاربران */}
          {users.length > 0 && userSearch.length > 1 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setUserSearch(user.name);
                    setUsers([]);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 text-sm flex flex-col"
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedUserId && (
          <p className="text-xs text-green-600 mt-1">✅ کاربر انتخاب شد.</p>
        )}
      </div>

      {/* --- بخش دوم: افزودن محصولات --- */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">محصولات سفارش</h3>
          <div className="relative">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                searchProducts(e.target.value);
                setShowProductDropdown(true);
              }}
              onFocus={() => setShowProductDropdown(true)}
              placeholder="جستجوی محصول برای اضافه کردن..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />

            {/* لیست کشویی محصولات */}
            {showProductDropdown &&
              (productSearch.length > 0 || products.length > 0) && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoadingProducts && (
                    <div className="p-3 text-center text-xs text-gray-400">
                      در حال جستجو...
                    </div>
                  )}
                  {!isLoadingProducts &&
                    products.length === 0 &&
                    productSearch.length > 0 && (
                      <div className="p-3 text-center text-xs text-gray-400">
                        محصولی یافت نشد
                      </div>
                    )}
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addToCart(product)}
                      className="w-full text-right px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex justify-between"
                    >
                      <span className="font-medium text-sm">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.price.toLocaleString()} ریال
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* جدول سبد خرید */}
        {cartItems.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500">
                    محصول
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 text-center">
                    تعداد
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 text-center">
                    قیمت واحد (ریال)
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 text-center">
                    مبلغ کل (ریال)
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 text-center">
                    حذف
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {item.productName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-gray-900">
                      {item.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td
                    colSpan={3}
                    className="py-3 px-4 text-left font-bold text-gray-700"
                  >
                    مبلغ نهایی سفارش:
                  </td>
                  <td className="py-3 px-4 text-center text-lg font-bold text-blue-600">
                    {totalAmount.toLocaleString()} ریال
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
            برای شروع، محصولی را در باکس بالا جستجو کنید
          </div>
        )}
      </div>

      {/* --- بخش سوم: تنظیمات نهایی و ثبت --- */}
      <div className="flex flex-col md:flex-row gap-6 border-t pt-6">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-gray-700">
            وضعیت اولیه سفارش
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">در انتظار (Pending)</option>
            <option value="PROCESSING">در حال پردازش (Processing)</option>
            <option value="SHIPPED">ارسال شده (Shipped)</option>
          </select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-gray-700">
            یادداشت سفارش (اختیاری)
          </label>
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            rows={2}
            placeholder="توضیحات یا یادداشت..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* دکمه‌های عملیات */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              در حال ثبت...
            </>
          ) : (
            "ثبت سفارش"
          )}
        </button>
      </div>
    </form>
  );
}
