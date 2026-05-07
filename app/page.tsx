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
        const response = await fetch("/api/posts");
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-xl text-gray-500">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
      </div>

      {/* NEW: Search Input UI */}
      {posts.length > 0 && (
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
          <p>No posts found. Be the first to create one!</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        // Empty state specifically for when a search has no results
        <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
          <p>No posts match your search for &quot;{searchTerm}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <div className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  By {post.author?.name || "Unknown Author"} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 grow">
                  {post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}