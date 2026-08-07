"use client";
import UserForm from "@/components/dashboard/user/UserForm";
import { CoreTable } from "@/components/ui/CoreTable";
import { deleteUser, fetchUsers } from "@/lib/api/users";
import { User } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("خطا در دریافت کاربران");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کاربر مطمئن هستید؟")) return;

    try {
      setSubmitting(true);
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert("خطا در حذف کاربر");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = async () => {
    await loadUsers();
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  // تعریف ستون‌ها
  const columns = [
    {
      key: "index",
      header: "#",
      render: (_: User, index: number) => <span>{index + 1}</span>,
      className: "w-16 text-center",
    },
    {
      key: "name",
      header: "نام کاربر",
      render: (user: User) => (
        <span className="font-medium text-gray-800">{user.name}</span>
      ),
    },
    {
      key: "phone",
      header: "شماره تماس",
      render: (user: User) => <span dir="ltr">{user.phone}</span>,
    },
    {
      key: "email",
      header: "ایمیل",
      render: (user: User) => (
        <span className="text-blue-600">{user.email}</span>
      ),
    },
    {
      key: "createdAt",
      header: "تاریخ ثبت نام",
      render: (user: User) => formatDate(user.createdAt),
    },
    {
      key: "actions",
      header: "عملیات",
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors text-sm flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            ویرایش
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </button>
        </div>
      ),
      className: "w-48",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span>
          افزودن کاربر جدید
        </button>
      </div>

      <CoreTable
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ کاربری یافت نشد"
        rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingUser ? "ویرایش کاربر" : "افزودن کاربر جدید"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <UserForm
                user={editingUser || undefined}
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
