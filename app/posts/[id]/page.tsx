"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Post } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function PostDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();

  // extract the ID from the URL
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if there's no ID
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/${id}`);

        if (response.status === 404) {
          throw new Error("Post not found.");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch post details.");
        }

        const data = await response.json();
        setPost(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch post details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Enter edit mode
  const startEditing = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditError(null);
    setIsEditing(true);
  };

  // Cancel edit mode
  const cancelEditing = () => {
    setIsEditing(false);
    setEditError(null);
  };

  // Save the updated post
  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setEditError("Title and content cannot be empty.");
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update post.");
      }

      const updatedPost = await response.json();
      // Update local state with the response
      setPost((prev) =>
        prev
          ? { ...prev, title: updatedPost.title, content: updatedPost.content }
          : prev
      );
      setIsEditing(false);
    } catch (err: unknown) {
      setEditError(
        err instanceof Error ? err.message : "Failed to update post."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handler to delete the post
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post.");
      }

      // If successful, push back to home and refresh the list
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete post.");
      setIsDeleting(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="w-24 h-5 bg-stone-100 rounded loading-pulse mb-8" />
        <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <div className="w-3/4 h-8 bg-stone-100 rounded-lg loading-pulse mb-4" />
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-stone-100">
            <div className="w-10 h-10 rounded-full bg-stone-100 loading-pulse" />
            <div>
              <div className="w-32 h-4 bg-stone-100 rounded loading-pulse mb-2" />
              <div className="w-48 h-3 bg-stone-50 rounded loading-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-4 bg-stone-50 rounded loading-pulse" />
            <div className="w-full h-4 bg-stone-50 rounded loading-pulse" />
            <div className="w-2/3 h-4 bg-stone-50 rounded loading-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // Error or Post Not Found
  if (error || !post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10 text-center">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
        <Link
          href="/"
          className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }

  const isOwner = user && post.authorId === user.id;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="mb-8 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All posts
        </Link>
        {/* Actions: only show if the user is logged in and owner of the post */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={startEditing}
              className="text-sm text-stone-400 hover:text-indigo-500 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-stone-400 hover:text-red-500 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <article className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
        {/* Edit error */}
        {editError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
            {editError}
          </div>
        )}

        {isEditing ? (
          /* ---- Edit Mode ---- */
          <>
            <div className="mb-5">
              <label htmlFor="edit-title" className="block text-sm font-medium text-stone-700 mb-1.5">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isSaving}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-all hover:border-stone-300"
              />
            </div>

            {/* Author info (read-only during edit) */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-sm">
                  {post.author?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {post.author?.name}
                </p>
                <p className="text-xs text-stone-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="edit-content" className="block text-sm font-medium text-stone-700 mb-1.5">
                Content
              </label>
              <textarea
                id="edit-content"
                rows={12}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isSaving}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-all hover:border-stone-300 resize-none leading-relaxed"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={cancelEditing}
                disabled={isSaving}
                className="text-sm font-medium text-stone-500 hover:text-stone-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`text-sm font-medium text-white px-5 py-2 rounded-xl transition-all active:scale-[0.98] ${
                  isSaving
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600 hover:shadow-md"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        ) : (
          /* ---- View Mode ---- */
          <>
            <h1 className="text-3xl font-bold text-stone-900 mb-5 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-sm">
                  {post.author?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {post.author?.name}
                </p>
                <p className="text-xs text-stone-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="text-stone-700 whitespace-pre-wrap leading-relaxed text-[15px]">
              {post.content}
            </div>
          </>
        )}
      </article>
    </main>
  );
}
