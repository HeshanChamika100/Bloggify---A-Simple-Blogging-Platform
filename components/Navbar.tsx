"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
              Bloggify
            </span>
          </Link>

          {isLoading ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-16 h-8 bg-stone-100 rounded-lg loading-pulse" />
              <div className="w-16 h-8 bg-stone-100 rounded-lg loading-pulse" />
            </div>
          ) : user ? (
            <div className="hidden sm:flex sm:items-center sm:gap-3">
              <span className="text-sm text-stone-500 hidden sm:inline-block mr-1">
                <span className="text-stone-900 font-medium">{user.name}</span>
              </span>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-indigo-600"
              >
                Profile
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-md active:scale-[0.97]"
              >
                + New Post
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-400 transition-colors hover:border-red-100 hover:text-red-500"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex sm:items-center sm:gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-indigo-600"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-md active:scale-[0.97]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {isLoading ? (
            <>
              <div className="h-10 min-w-24 flex-1 rounded-full bg-stone-100 loading-pulse" />
              <div className="h-10 min-w-24 flex-1 rounded-full bg-stone-100 loading-pulse" />
            </>
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="flex-1 whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-stone-700 shadow-sm"
              >
                Profile
              </Link>
              <Link
                href="/create"
                className="flex-1 whitespace-nowrap rounded-full bg-indigo-500 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm"
              >
                + New Post
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex-1 whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-stone-500 shadow-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex-1 whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-stone-700 shadow-sm"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="flex-1 whitespace-nowrap rounded-full bg-indigo-500 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm"
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