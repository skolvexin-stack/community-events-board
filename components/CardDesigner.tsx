"use client";

import { useEffect, useRef, useState } from "react";

const THEMES = [
  {
    id: "classic",
    label: "Classic",
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    text: "#1c1917",
  },
  {
    id: "dark",
    label: "Dark",
    bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    text: "#e0e7ff",
  },
  {
    id: "gradient",
    label: "Gradient",
    bg: "linear-gradient(135deg, #7c3aed 0%, #ea580c 100%)",
    text: "#ffffff",
  },
];

const STICKERS = ["🎵", "🍕", "⚽", "🎨", "✨"];

interface CardDesignerProps {
  eventId: string;
  eventTitle: string;
  eventCity: string;
  eventDate: string;
}

export default function CardDesigner({
  eventId,
  eventTitle,
  eventCity,
  eventDate,
}: CardDesignerProps) {
  const [theme, setTheme] = useState("classic");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Refs so save() never reads stale state from closures
  const themeRef = useRef("classic");
  const selectedRef = useRef<string[]>([]);
  // Prevent the initial DB load from overriding a choice the user already made
  const userPickedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    setIsLoggedIn(true);

    fetch(`/api/card-design/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.design && !userPickedRef.current) {
          const t = data.design.theme ?? "classic";
          const s = Array.isArray(data.design.stickers) ? data.design.stickers : [];
          themeRef.current = t;
          selectedRef.current = s;
          setTheme(t);
          setSelected(s);
        }
      })
      .catch(() => {});
  }, [eventId]);

  async function save(nextTheme: string, nextStickers: string[]) {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    setSaving(true);
    try {
      await fetch(`/api/card-design/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: nextTheme, stickers: nextStickers }),
      });
    } finally {
      setSaving(false);
    }
  }

  function selectTheme(id: string) {
    userPickedRef.current = true;
    themeRef.current = id;
    setTheme(id);
    save(id, selectedRef.current);
  }

  function toggleSticker(s: string) {
    userPickedRef.current = true;
    setSelected((prev) => {
      const next = prev.includes(s)
        ? prev.filter((x) => x !== s)
        : prev.length < 3
        ? [...prev, s]
        : prev;
      selectedRef.current = next;
      save(themeRef.current, next);
      return next;
    });
  }

  const activeTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <section
      className="mt-10 rounded-xl p-6"
      style={{ background: "var(--muted-bg)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-base font-semibold mb-5" style={{ color: "var(--foreground)" }}>
        Design your card
        {saving && (
          <span className="ml-2 text-xs font-normal" style={{ color: "var(--muted)" }}>
            Saving...
          </span>
        )}
        {!isLoggedIn && (
          <span className="ml-2 text-xs font-normal" style={{ color: "var(--muted)" }}>
            (log in to save)
          </span>
        )}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Controls */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              Background theme
            </p>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTheme(t.id)}
                  className="px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer"
                  style={{
                    background: theme === t.id ? "var(--primary)" : "var(--card-bg)",
                    color: theme === t.id ? "var(--primary-fg)" : "var(--foreground)",
                    borderColor: theme === t.id ? "var(--primary)" : "var(--border)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              Stickers (up to 3)
            </p>
            <div className="flex gap-2">
              {STICKERS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSticker(s)}
                  className="w-10 h-10 text-xl rounded-lg border transition-colors cursor-pointer"
                  style={{
                    background: selected.includes(s) ? "var(--primary)" : "var(--card-bg)",
                    borderColor: selected.includes(s) ? "var(--primary)" : "var(--border)",
                    opacity: !selected.includes(s) && selected.length >= 3 ? 0.4 : 1,
                  }}
                  title={
                    selected.includes(s)
                      ? "Remove sticker"
                      : selected.length >= 3
                      ? "Max 3 stickers"
                      : "Add sticker"
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div
          className="w-full lg:w-64 rounded-xl p-5 flex-shrink-0"
          style={{
            background: activeTheme.bg,
            minHeight: "160px",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70"
            style={{ color: activeTheme.text }}
          >
            Event
          </p>
          <h3
            className="text-base font-bold leading-snug mb-3"
            style={{ color: activeTheme.text }}
          >
            {eventTitle}
          </h3>
          <p className="text-xs opacity-80 mb-1" style={{ color: activeTheme.text }}>
            {eventCity}
          </p>
          <p className="text-xs opacity-80 mb-3" style={{ color: activeTheme.text }}>
            {eventDate}
          </p>
          {selected.length > 0 && (
            <div className="flex gap-1.5">
              {selected.map((s) => (
                <span key={s} className="text-xl">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
