"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/types";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to hold the user's search input
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Unable to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter the posts based on the search term
  const filteredPosts = posts.filter((post) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesTitle = post.title.toLowerCase().includes(searchLower);
    const matchesAuthor = post.author?.name.toLowerCase().includes(searchLower);
    return matchesTitle || matchesAuthor;
  });

  // Skeleton loader
  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="w-48 h-8 bg-stone-200 rounded-lg loading-pulse mb-2" />
          <div className="w-72 h-5 bg-stone-100 rounded-lg loading-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-6"
            >
              <div className="w-3/4 h-6 bg-stone-100 rounded-lg loading-pulse mb-3" />
              <div className="w-1/2 h-4 bg-stone-100 rounded loading-pulse mb-4" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-stone-50 rounded loading-pulse" />
                <div className="w-2/3 h-4 bg-stone-50 rounded loading-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Header + Search */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-1">Blog Posts</h1>
          <p className="text-stone-500">Discover stories, ideas, and insights</p>
        </div>

        {posts.length > 0 && (
          <div className="relative w-full md:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 transition-all hover:border-stone-300"
            />
          </div>
        )}
      </div>

      {/* Post Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-stone-500 mb-1">No posts yet</p>
          <p className="text-sm text-stone-400">Be the first to share something!</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-500">
            No posts match &quot;{searchTerm}&quot;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <article className="group bg-white rounded-xl border border-stone-200 p-6 h-full flex flex-col transition-all hover:border-stone-300 hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-0.5">
                <h2 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">
                      {post.author?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <span className="text-sm text-stone-500">
                    {post.author?.name || "Unknown"} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed grow line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors">
                    Read more →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}