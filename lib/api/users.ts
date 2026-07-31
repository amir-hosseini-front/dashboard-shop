import { User } from "@/types";
const API_BASE = "/api";

export let dbUsers: User[] = [
  {
    id: "user-1",
    name: "علی محمدی",
    email: "ali@example.com",
    phone: "09123456789",
    address: "تهران، خیابان آزادی، پلاک ۱۲۳",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "user-2",
    name: "مریم احمدی",
    email: "maryam@example.com",
    phone: "09129876543",
    address: "اصفهان، خیابان چهارباغ، پلاک ۴۵",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "user-3",
    name: "رضا کریمی",
    email: "reza@example.com",
    phone: "09127654321",
    address: "شیراز، خیابان زند، پلاک ۷۸",
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "user-4",
    name: "سارا حسینی",
    email: "sara@example.com",
    phone: "09125432187",
    address: "مشهد، خیابان احمدآباد، پلاک ۵۶",
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "user-5",
    name: "محمد قاسمی",
    email: "mohammad@example.com",
    phone: "09123216548",
    address: "تبریز، خیابان امام، پلاک ۹۰",
    createdAt: new Date("2026-02-01"),
  },
];

export async function fetchUsers() {
  const res = await fetch(`/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("خطا در دریافت کاربر");
  return res.json();
}

export async function createUser(data: any) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("خطا در ایجاد کاربر");
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("خطا در ویرایش کاربر");
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("خطا در حذف کاربر");
  return res.json();
}
