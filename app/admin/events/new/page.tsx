"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    category: "Music",
    city: "",
    dateTime: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create event");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm mb-6 hover:underline"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} />
        Back to dashboard
      </Link>

      <h1 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        Add new event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="e.g. Bangalore Blues Night"
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={inputStyle}
          />
        </Field>

        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={inputStyle}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="City">
          <input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            required
            placeholder="e.g. Bengaluru"
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={inputStyle}
          />
        </Field>

        <Field label="Date & time">
          <input
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => set("dateTime", e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={inputStyle}
          />
        </Field>

        <Field label="Price (₹, enter 0 for free)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={inputStyle}
          />
        </Field>

        <Field label="Image URL">
          <input
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            required
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={inputStyle}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={4}
            placeholder="Describe the event..."
            className="w-full px-3 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            style={inputStyle}
          />
        </Field>

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
          {loading ? "Creating..." : "Create event"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
