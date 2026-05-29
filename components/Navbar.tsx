"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200/60">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-lg font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
            Bloggify
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-stone-100 rounded-lg loading-pulse" />
              <div className="w-16 h-8 bg-stone-100 rounded-lg loading-pulse" />
            </div>
          ) : user ? (
            <>
              <span className="text-sm text-stone-500 hidden sm:inline-block mr-1">
                <span className="text-stone-900 font-medium">{user.name}</span>
              </span>
              <Link
                href="/profile"
                className="text-sm font-medium text-stone-600 hover:text-indigo-600 transition-colors px-2 py-2"
              >
                Edit Profile
              </Link>
              <Link
                href="/create"
                className="text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg px-4 py-2 transition-all hover:shadow-md active:scale-[0.97]"
              >
                + New Post
              </Link>
              <button
                onClick={logout}
                className="text-sm text-stone-400 hover:text-red-500 font-medium transition-colors px-2 py-2"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-stone-600 hover:text-indigo-600 transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all hover:shadow-md active:scale-[0.97]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}