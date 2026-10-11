"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ToggleLeft, ToggleRight, Shield, LogOut } from "lucide-react";
import { formatEventDate, formatINR } from "@/lib/format";

interface Event {
  _id: string;
  title: string;
  category: string;
  city: string;
  dateTime: string;
  price: number;
  isActive: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/admin/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  async function toggleActive(id: string) {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setToggling(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, isActive: data.event.isActive } : e))
        );
      }
    } finally {
      setToggling(null);
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  const categoryColors: Record<string, string> = {
    Music: "#7c3aed",
    Workshop: "#0284c7",
    Food: "#ea580c",
    Sports: "#16a34a",
    Kids: "#db2777",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Shield size={18} style={{ color: "var(--primary)" }} />
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Admin — Events
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/new"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            <Plus size={14} />
            Add event
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border cursor-pointer transition-colors hover:bg-[var(--muted-bg)]"
            style={{ color: "var(--muted)", borderColor: "var(--border)" }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ background: "var(--muted-bg)" }}
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "var(--muted-bg)" }}
        >
          <p style={{ color: "var(--muted)" }}>No events yet. Add the first one.</p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--muted-bg)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>
                  Event
                </th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: "var(--muted)" }}>
                  Price
                </th>
                <th className="text-center px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr
                  key={event._id}
                  style={{
                    background: "var(--card-bg)",
                    borderBottom: idx < events.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: "var(--foreground)" }}>
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full text-white"
                        style={{
                          background: categoryColors[event.category] ?? "#6b7280",
                        }}
                      >
                        {event.category}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {event.city}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 hidden sm:table-cell text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {formatEventDate(event.dateTime)}
                  </td>
                  <td
                    className="px-4 py-3 hidden md:table-cell text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {formatINR(event.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(event._id)}
                      disabled={toggling === event._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer disabled:opacity-60"
                      style={{
                        background: event.isActive ? "#dcfce7" : "var(--muted-bg)",
                        color: event.isActive ? "#166534" : "var(--muted)",
                        borderColor: event.isActive ? "#bbf7d0" : "var(--border)",
                      }}
                    >
                      {event.isActive ? (
                        <ToggleRight size={13} />
                      ) : (
                        <ToggleLeft size={13} />
                      )}
                      {event.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
