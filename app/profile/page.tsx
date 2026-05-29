"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isLoading, router, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        ...(password ? { password } : {}),
      });

      setPassword("");
      setConfirmPassword("");
      setSuccess("Profile updated successfully.");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Failed to update profile.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="h-8 w-48 bg-stone-100 rounded-lg loading-pulse mb-3" />
          <div className="h-4 w-72 bg-stone-100 rounded-lg loading-pulse mb-8" />
          <div className="space-y-4">
            <div className="h-12 bg-stone-50 rounded-xl loading-pulse" />
            <div className="h-12 bg-stone-50 rounded-xl loading-pulse" />
            <div className="h-12 bg-stone-50 rounded-xl loading-pulse" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.2)]">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600 mb-2">Account settings</p>
          <h1 className="text-3xl font-bold text-stone-900">Edit profile</h1>
          <p className="text-stone-500 mt-2">
            Update your public name, sign-in email, or password.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-indigo-400 focus:outline-none"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-indigo-400 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-indigo-400 focus:outline-none"
              placeholder="Leave blank to keep current password"
              minLength={6}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-indigo-400 focus:outline-none"
              placeholder="Confirm the new password"
              minLength={6}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isSaving ? "Saving changes..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 px-5 py-3 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
