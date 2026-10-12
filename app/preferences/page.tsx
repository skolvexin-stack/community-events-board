"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Music", "Workshop", "Food", "Sports", "Kids"];

const descriptions: Record<string, string> = {
  Music: "Concerts, live bands, DJ nights",
  Workshop: "Skill-building, hands-on sessions",
  Food: "Street food, restaurant events, food fairs",
  Sports: "Tournaments, runs, fitness events",
  Kids: "Family-friendly activities for children",
};

export default function PreferencesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    tokenRef.current = token;

    fetch("/api/preferences", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSelected(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  function persistCategories(next: string[]) {
    const token = tokenRef.current;
    if (!token) return;

    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories: next }),
      })
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("idle"));
    }, 400);
  }

  function toggle(cat: string) {
    setSelected((prev) => {
      const next = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat];
      persistCategories(next);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="h-8 w-48 rounded animate-pulse" style={{ background: "var(--muted-bg)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
        Your interests
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Pick the categories you care about and your feed will show only those events.
      </p>

      <div className="space-y-2 mb-8">
        {CATEGORIES.map((cat) => {
          const on = selected.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer"
              style={{
                background: on ? "var(--primary)" : "var(--card-bg)",
                border: `1px solid ${on ? "var(--primary)" : "var(--border)"}`,
                color: on ? "var(--primary-fg)" : "var(--foreground)",
              }}
            >
              <div>
                <p className="text-sm font-medium">{cat}</p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: on ? "rgba(255,255,255,0.75)" : "var(--muted)" }}
                >
                  {descriptions[cat]}
                </p>
              </div>
              {on && <Check size={16} />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {saveState === "saving" && (
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Saving...
          </span>
        )}
        {saveState === "saved" && (
          <>
            <span className="text-sm" style={{ color: "var(--primary)" }}>
              Saved
            </span>
            <Link href="/feed" className="text-sm font-medium" style={{ color: "var(--primary)" }}>
              View My Feed →
            </Link>
          </>
        )}
        {saveState === "idle" && selected.length > 0 && (
          <Link href="/feed" className="text-sm font-medium" style={{ color: "var(--primary)" }}>
            View My Feed →
          </Link>
        )}
      </div>
    </div>
  );
}
