import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { formatINR, formatEventDate } from "@/lib/format";

interface CardDesign {
  theme: string;
  stickers: string[];
}

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    category: string;
    city: string;
    dateTime: string | Date;
    price: number;
    description: string;
    imageUrl: string;
  };
  design?: CardDesign;
}

const categoryColors: Record<string, string> = {
  Music: "#7c3aed",
  Workshop: "#0284c7",
  Food: "#ea580c",
  Sports: "#16a34a",
  Kids: "#db2777",
};

const themes: Record<string, { bg: string; text: string; subtext: string }> = {
  classic: {
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    text: "#1c1917",
    subtext: "rgba(28,25,23,0.6)",
  },
  dark: {
    bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    text: "#e0e7ff",
    subtext: "rgba(224,231,255,0.6)",
  },
  gradient: {
    bg: "linear-gradient(135deg, #7c3aed 0%, #ea580c 100%)",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.7)",
  },
};

export default function EventCard({ event, design }: EventCardProps) {
  const color = categoryColors[event.category] ?? "#6b7280";

  if (design) {
    const th = themes[design.theme] ?? themes.classic;
    return (
      <Link
        href={`/events/${event._id}`}
        className="block rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Image — preserved, stickers float over it */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full text-white"
            style={{ background: color }}
          >
            {event.category}
          </span>
          {design.stickers.length > 0 && (
            <span className="absolute bottom-2 right-3 text-xl leading-none">
              {design.stickers.join(" ")}
            </span>
          )}
        </div>

        {/* Info section — themed gradient */}
        <div
          className="p-4"
          style={{ background: th.bg }}
        >
          <h3
            className="font-semibold text-base leading-snug mb-2 line-clamp-2"
            style={{ color: th.text }}
          >
            {event.title}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: th.subtext }}>
              <Clock size={13} />
              <span>{formatEventDate(event.dateTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: th.subtext }}>
              <MapPin size={13} />
              <span>{event.city}</span>
            </div>
          </div>

          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${th.subtext}` }}>
            <span className="text-sm font-semibold" style={{ color: th.text }}>
              {formatINR(event.price)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event._id}`}
      className="block rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <span
          className="absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full text-white"
          style={{ background: color }}
        >
          {event.category}
        </span>
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-base leading-snug mb-2 line-clamp-2"
          style={{ color: "var(--foreground)" }}
        >
          {event.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
            <Clock size={13} />
            <span>{formatEventDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
            <MapPin size={13} />
            <span>{event.city}</span>
          </div>
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            {formatINR(event.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
