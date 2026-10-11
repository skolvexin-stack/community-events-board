export const instant = false;

import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { MapPin, Calendar, IndianRupee, ArrowLeft } from "lucide-react";
import Link from "next/link";
import mongoose from "mongoose";
import RemindButton from "@/components/RemindButton";
import CardDesigner from "@/components/CardDesigner";
import { formatINR, formatEventDate } from "@/lib/format";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const event = await Event.findById(id).lean();
  if (!event) notFound();

  const categoryColors: Record<string, string> = {
    Music: "#7c3aed",
    Workshop: "#0284c7",
    Food: "#ea580c",
    Sports: "#16a34a",
    Kids: "#db2777",
  };

  const color = categoryColors[event.category] ?? "#6b7280";
  const eventId = event._id.toString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm mb-6 hover:underline"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} />
        Back to events
      </Link>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="relative h-64 sm:h-80">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <span
            className="absolute top-4 left-4 text-sm font-medium px-3 py-1 rounded-full text-white"
            style={{ background: color }}
          >
            {event.category}
          </span>
          {!event.isActive && (
            <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-black/60 text-white">
              Inactive
            </span>
          )}
        </div>

        <div className="p-6">
          <h1
            className="text-2xl font-bold mb-4 leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            {event.title}
          </h1>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              className="flex items-center gap-2 text-sm p-3 rounded-lg"
              style={{ background: "var(--muted-bg)" }}
            >
              <Calendar size={15} style={{ color: "var(--primary)" }} />
              <span style={{ color: "var(--foreground)" }}>
                {formatEventDate(event.dateTime)}
              </span>
            </div>
            <div
              className="flex items-center gap-2 text-sm p-3 rounded-lg"
              style={{ background: "var(--muted-bg)" }}
            >
              <MapPin size={15} style={{ color: "var(--primary)" }} />
              <span style={{ color: "var(--foreground)" }}>{event.city}</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm p-3 rounded-lg col-span-2"
              style={{ background: "var(--muted-bg)" }}
            >
              <IndianRupee size={15} style={{ color: "var(--primary)" }} />
              <span style={{ color: "var(--foreground)" }}>
                {formatINR(event.price)}
              </span>
            </div>
          </div>

          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--muted)" }}
          >
            {event.description}
          </p>

          <RemindButton eventId={eventId} initialReminded={false} />
        </div>
      </div>

      <CardDesigner
        eventId={eventId}
        eventTitle={event.title}
        eventCity={event.city}
        eventDate={formatEventDate(event.dateTime)}
      />
    </div>
  );
}
