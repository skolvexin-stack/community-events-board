import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import mongoose from "mongoose";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: "Invalid event ID" }, { status: 400 });
  }

  await connectDB();

  const event = await Event.findById(id).lean();
  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  return Response.json({ event });
}
