const API_BASE = "/api";
export let orders = [
  {
    id: "#۱۰۰۱",
    customer: "علی محمدی",
    amount: "۲,۴۵۰,۰۰۰",
    status: "پرداخت شده",
    date: "۱۴۰۵/۰۴/۲۵",
  },
  {
    id: "#۱۰۰۲",
    customer: "سارا احمدی",
    amount: "۸۹۰,۰۰۰",
    status: "در انتظار",
    date: "۱۴۰۵/۰۴/۲۴",
  },
  {
    id: "#۱۰۰۳",
    customer: "رضا کریمی",
    amount: "۵,۶۰۰,۰۰۰",
    status: "پرداخت شده",
    date: "۱۴۰۵/۰۴/۲۴",
  },
  {
    id: "#۱۰۰۴",
    customer: "مریم حسینی",
    amount: "۱,۲۰۰,۰۰۰",
    status: "لغو شده",
    date: "۱۴۰۵/۰۴/۲۳",
  },
  {
    id: "#۱۰۰۵",
    customer: "احمد نوری",
    amount: "۳,۳۰۰,۰۰۰",
    status: "در انتظار",
    date: "۱۴۰۵/۰۴/۲۳",
  },
  {
    id: "#۱۰۰۶",
    customer: "زهرا رضایی",
    amount: "۴,۲۰۰,۰۰۰",
    status: "پرداخت شده",
    date: "۱۴۰۵/۰۴/۲۲",
  },
];
export async function fetchOrders() {
  const res = await fetch(`/api/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("خطا در دریافت محصولات");
  return res.json();
}
