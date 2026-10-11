import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { verifyAdminToken, tokenFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = tokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: "Invalid event ID" }, { status: 400 });
  }

  await connectDB();

  const event = await Event.findById(id);
  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  event.isActive = !event.isActive;
  await event.save();

  return Response.json({ event });
}
