const API_BASE = "/api";
export let products = [
  { id: 1, name: "کیک چرمی", price: 45000, stock: 45, status: "موجود" },
  { id: 2, name: "کشو اسپرت", price: 120000, stock: 12, status: "موجود" },
  { id: 3, name: "ساعت هوشمند", price: 0, stock: 0, status: "ناموجود" },
  { id: 4, name: "هدفون بی‌سیم", price: 230000, stock: 23, status: "موجود" },
];
export async function fetchProducts() {
  const res = await fetch(`/api/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("خطا در دریافت محصولات");
  return res.json();
}

export async function fetchProduct(id: number) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("خطا در دریافت محصول");
  return res.json();
}

export async function createProduct(data: any) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("خطا در ایجاد محصول");
  return res.json();
}

export async function updateProduct(id: number, data: any) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("خطا در ویرایش محصول");
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("خطا در حذف محصول");
  return res.json();
}
