"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      localStorage.setItem("user_token", data.token);
      document.cookie = `user_token=${data.token}; path=/; max-age=${7 * 24 * 3600}`;
      window.dispatchEvent(new Event("user-auth-change"));
      router.push("/preferences");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3"
            style={{ background: "var(--muted-bg)" }}
          >
            <UserPlus size={18} style={{ color: "var(--primary)" }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Create account
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Get personalised event recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={{
                background: "var(--muted-bg)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={{
                background: "var(--muted-bg)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium rounded-lg transition-opacity disabled:opacity-60 cursor-pointer"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--primary)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
