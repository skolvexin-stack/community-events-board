"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";

interface RemindButtonProps {
  eventId: string;
  initialReminded: boolean;
}

export default function RemindButton({ eventId, initialReminded }: RemindButtonProps) {
  const [reminded, setReminded] = useState(initialReminded);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const prev = reminded;
    setReminded(!prev);
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        setReminded(prev);
        setError("Please log in to set reminders");
        return;
      }

      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      if (!res.ok) {
        setReminded(prev);
        setError("Failed to save. Please try again.");
      }
    } catch {
      setReminded(prev);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button
        onClick={toggle}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-60"
        style={{
          background: reminded ? "var(--primary)" : "var(--muted-bg)",
          color: reminded ? "var(--primary-fg)" : "var(--foreground)",
          border: "1px solid var(--border)",
        }}
      >
        {reminded ? <BellOff size={15} /> : <Bell size={15} />}
        {reminded ? "Reminder set" : "Remind me"}
      </button>
      {error && (
        <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
