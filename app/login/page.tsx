"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth(); // Bring in the global login function

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Update global state and localStorage
      login(data.user);
      
      // Redirect to home page
      router.push("/");
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
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
    </main>
  );
}