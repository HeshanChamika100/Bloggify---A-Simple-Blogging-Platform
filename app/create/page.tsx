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
      <div className="max-w-2xl mx-auto p-8 mt-20 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You must be logged in to create a post.
        </h2>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
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
    <main className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-8 gap-4">
        <Link href="/" className="text-gray-500 hover:text-gray-800 transition">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold">Create a New Post</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Show who is posting so the user knows the app remembers them */}
      <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Posting as {user.name}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Post Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="My Awesome Blog Post"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Post Content
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your content here..."
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md text-white font-medium transition ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </main>
  );
}
