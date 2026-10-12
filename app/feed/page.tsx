"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { Rss } from "lucide-react";

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

export default function FeedPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [designs, setDesigns] = useState<Record<string, CardDesign>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch("/api/feed", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        if (data.message) setMessage(data.message);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/card-designs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setDesigns(data.designs ?? {}))
      .catch(() => {});
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Rss size={20} style={{ color: "var(--primary)" }} />
            My Feed
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Upcoming events from your favourite categories
          </p>
        </div>
        <Link
          href="/preferences"
          className="text-sm px-3 py-1.5 rounded-lg border transition-colors hover:bg-[var(--muted-bg)] flex-shrink-0"
          style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
        >
          Edit preferences
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-xl animate-pulse"
              style={{ background: "var(--muted-bg)" }}
            />
          ))}
        </div>
      ) : message ? (
        <div
          className="text-center py-20 rounded-xl"
          style={{ background: "var(--muted-bg)" }}
        >
          <Rss size={28} className="mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium mb-2" style={{ color: "var(--foreground)" }}>
            No categories selected
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            Pick your interests and we'll show you matching events here.
          </p>
          <Link
            href="/preferences"
            className="inline-block px-4 py-2 text-sm font-medium rounded-lg"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            Set preferences
          </Link>
        </div>
      ) : events.length === 0 ? (
        <div
          className="text-center py-20 rounded-xl"
          style={{ background: "var(--muted-bg)" }}
        >
          <p className="text-base font-medium mb-1" style={{ color: "var(--foreground)" }}>
            No upcoming events in your categories
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            Check back later or explore all events.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 text-sm font-medium rounded-lg"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            Explore all events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} design={designs[event._id]} />
          ))}
        </div>
      )}
    </div>
  );
}
