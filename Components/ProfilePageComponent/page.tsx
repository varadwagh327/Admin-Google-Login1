"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/zustand/store/useAuthStore";

// ✅ Updated User type
interface User {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  birthday?: string;
  phone?: string;
  address?: string;
  provider?: string;
  providerId?: string;
  _id?: string;
  __v?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, hydrate, isHydrated, login } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    role: "",
    avatar: "",
    birthday: "",
    phone: "",
    address: "",
    provider: "",
    providerId: "",
  });

  // hydrate Zustand state from localStorage
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // keep form data in sync with store
  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-lg">No profile found. Please login.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSave = () => {
    // Update Zustand store with edited user
    login({ ...form }, localStorage.getItem("token"));
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={
              user.avatar
                ? user.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}`
            }
            alt={user.name}
            className="h-24 w-24 rounded-full object-cover border"
          />
          <h2 className="text-2xl font-semibold mt-3">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="text-sm text-blue-600 mt-1">
            {user.role || "User"}
          </span>
        </div>

        {/* Profile details */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role</span>
            <span>{user.role || "User"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Birthday</span>
            <span>{user.birthday || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone</span>
            <span>{user.phone || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Address</span>
            <span>{user.address || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider</span>
            <span>{user.provider || "local"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-between">
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold">Edit Profile</h3>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-md p-2"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-md p-2"
                placeholder="Email"
              />
              <input
                type="date"
                value={form.birthday || ""}
                onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                className="w-full border rounded-md p-2"
                placeholder="Birthday"
              />
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-md p-2"
                placeholder="Phone Number"
              />
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-md p-2"
                placeholder="Address"
              />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
