"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth(); // Get the current logged in user

  // Form States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user isn't logged in, don't let them see the form
  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">
            Sign in required
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            You need to be logged in to create a post.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-indigo-600 transition-all hover:shadow-md active:scale-[0.98]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!title || !content) {
      setError("Please fill out all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Automatically inject the logged in user's name and email
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          title,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post.");
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Create post error:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Failed to create post.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-stone-900 mb-6">Create a new post</h1>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Author badge */}
      <div className="mb-6 bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
          <span className="text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-900">
            {user.name}
          </p>
          <p className="text-xs text-stone-500">{user.email}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-all hover:border-stone-300"
            placeholder="Give your post a title..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-all hover:border-stone-300 resize-none leading-relaxed"
            placeholder="Write your thoughts..."
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all active:scale-[0.98] ${
            isSubmitting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 hover:shadow-md"
          }`}
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </main>
  );
}
