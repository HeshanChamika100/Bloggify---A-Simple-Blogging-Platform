"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
          Bloggify
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            // Logged in user see this
            <>
              <span className="text-sm text-gray-600 hidden sm:inline-block">
                Hello, <span className="font-semibold text-gray-900">{user.name}</span>
              </span>
              <Link 
                href="/create" 
                className="text-sm font-bold text-white bg-blue-600 rounded-md p-2 hover:bg-blue-900 transition"
              >
                Create Post
              </Link>
              <button
                onClick={logout}
                className="text-sm text-red-600 font-bold hover:text-red-700 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            // Logged out user see this
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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