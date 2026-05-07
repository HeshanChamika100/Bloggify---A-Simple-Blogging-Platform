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
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-xl text-gray-500">Loading post details...</p>
      </div>
    );
  }

  // Error or Post Not Found
  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      {/* Navigation and Actions */}
      <div className="mb-8 flex justify-between items-center">
        <Link href="/" className="text-gray-500 hover:text-gray-800 transition">
          &larr; Back to all posts
        </Link>
        {/* this button only shows if the user is logged in and owner of the post */}
        {user && post.authorId === user.id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 transition text-sm font-medium"
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        )}
      </div>

      {/* Post Content */}
      <article className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>

        <div className="flex items-center text-gray-500 mb-8 pb-4 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-900">By {post.author?.name}</p>
            <p className="text-sm">
              {post.author?.email} •{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>
    </main>
  );
}
