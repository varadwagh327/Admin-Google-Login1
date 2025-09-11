"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/app/redux/authSlice";
import { RootState, AppDispatch } from "@/app/redux/store";

interface TopbarProps {
  onMenuClick?: () => void; // callback to open sidebar
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = auth.user;
  const userName = user?.name || user?.email || "Guest";
  const userInitial = userName[0].toUpperCase();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm); // replace with actual search logic
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm px-4 md:px-6 py-2 md:py-3 flex items-center justify-between gap-3 md:gap-4">
      
      {/* Left side: Sidebar toggle + Welcome */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base md:text-xl font-semibold text-slate-900 truncate">
            Welcome, {userName} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 truncate">Role: {user?.role || "Admin"}</p>
        </div>
      </div>

      {/* Middle: Search bar (desktop only) */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-l-lg border border-r-0 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700"
        >
          🔍
        </button>
      </form>

      {/* Right side: Profile + Logout */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative">
        {/* Mobile search toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-slate-100"
          aria-label="Search"
          onClick={() => console.log("Mobile search clicked")}
        >
          🔍
        </button>

        {/* Profile avatar */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-9 w-9 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-700 font-semibold text-sm md:text-base"
          >
            {userInitial}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-md shadow-lg py-2 z-50">
              <Link href="/profile">
                <a
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
