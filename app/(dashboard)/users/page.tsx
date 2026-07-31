"use client";
import UserForm from "@/components/dashboard/user/UserForm";
import { deleteUser, fetchUsers } from "@/lib/api/users";
import { User } from "@/types";
import { use, useEffect, useState } from "react";
interface UserFormData {
  name: string;
  email: string;
  phone: string;
  address: string | undefined;
}
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
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
  const handleAddNew = async () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setShowModal(true);
  };

  const handleEdit = async (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setShowModal(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کاربر مطمئن هستید؟")) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert("خطا در حذف کاربر");
      console.error(err);
    }
  };

  const handleSuccess = async () => {
    await loadUsers();
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
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
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span>
          افزودن کاربر جدید
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
                نام کاربر
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                شماره تماس
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                ایمیل
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                تاریخ ثبت نام
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  هیچ کاربری یافت نشد
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-800 font-medium">
                    {user.name}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {user.phone}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="border-b border-gray-100 px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors text-sm"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
                user={editingUser}
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
