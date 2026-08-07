"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "داشبورد", href: "/", icon: HomeIcon },
  { name: "محصولات", href: "/products", icon: ShoppingBagIcon },
  { name: "سفارشات", href: "/orders", icon: ShoppingCartIcon },
  { name: "آمار", href: "/statistics", icon: ChartBarIcon },
  { name: "کاربران", href: "/users", icon: UserGroupIcon },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 fixed right-0 top-0">
      <div className="text-2xl font-bold mb-8 p-3 border-b border-gray-700">
        📊 پنل من
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all mt-4  pt-4"
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        <span className="font-medium">خروج</span>
      </button>

      <div className="absolute bottom-4 right-4 left-4 text-center text-xs text-gray-500">
        v1.0.0
      </div>
    </aside>
  );
}
