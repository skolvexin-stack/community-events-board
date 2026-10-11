"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];
const CITIES = ["Bengaluru", "Mumbai", "Chennai", "Hyderabad", "Coimbatore"];

interface Event {
  _id: string;
  title: string;
  category: string;
  city: string;
  dateTime: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface CardDesign {
  theme: string;
  stickers: string[];
}

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [designs, setDesigns] = useState<Record<string, CardDesign>>({});
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (city) params.set("city", city);
      if (q) params.set("q", q);
      params.set("page", String(page));

      const res = await fetch(`/api/events?${params}`);
      const data = await res.json();
      setEvents(data.events);
      setPagination(data.pagination);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [category, city, q, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch("/api/card-designs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setDesigns(data.designs ?? {}))
      .catch(() => {});
  }, []);

  function handleFilter(type: "category" | "city", value: string) {
    setPage(1);
    if (type === "category") setCategory((prev) => (prev === value ? "" : value));
    if (type === "city") setCity((prev) => (prev === value ? "" : value));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Upcoming Events
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Discover music nights, workshops, food fairs, and more near you
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </form>

        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal size={14} style={{ color: "var(--muted)" }} />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => handleFilter("category", c)}
              className="px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer"
              style={{
                background: category === c ? "var(--primary)" : "transparent",
                color: category === c ? "var(--primary-fg)" : "var(--foreground)",
                borderColor: category === c ? "var(--primary)" : "var(--border)",
              }}
            >
              {c}
            </button>
          ))}
          <span
            className="text-xs px-2"
            style={{ color: "var(--border)", userSelect: "none" }}
          >
            |
          </span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => handleFilter("city", c)}
              className="px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer"
              style={{
                background: city === c ? "var(--primary)" : "transparent",
                color: city === c ? "var(--primary-fg)" : "var(--foreground)",
                borderColor: city === c ? "var(--primary)" : "var(--border)",
              }}
            >
              {c}
            </button>
          ))}
          {(category || city || q) && (
            <button
              onClick={() => {
                setCategory("");
                setCity("");
                setQ("");
                setPage(1);
              }}
              className="text-xs px-2 py-1 cursor-pointer"
              style={{ color: "var(--muted)" }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-xl animate-pulse"
              style={{ background: "var(--muted-bg)" }}
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div
          className="text-center py-20 rounded-xl"
          style={{ background: "var(--muted-bg)" }}
        >
          <p className="text-base font-medium mb-1" style={{ color: "var(--foreground)" }}>
            No events found
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Try changing the category, city, or search term.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            {pagination.total} event{pagination.total !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event._id} event={event} design={designs[event._id]} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
