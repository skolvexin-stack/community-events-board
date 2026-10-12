import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyUserToken, tokenFromRequest } from "@/lib/auth";
import mongoose, { Types } from "mongoose";

export async function GET(request: NextRequest) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(payload.userId).select("reminders").lean();
  return Response.json({ reminders: user?.reminders ?? [] });
}

export async function POST(request: NextRequest) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { eventId } = body;

  if (!mongoose.isValidObjectId(eventId)) {
    return Response.json({ error: "Invalid event ID" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(payload.userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const oid = new mongoose.Types.ObjectId(eventId);
  const alreadySet = user.reminders.some((r: Types.ObjectId) => r.equals(oid));

  if (alreadySet) {
    user.reminders = user.reminders.filter((r: Types.ObjectId) => !r.equals(oid));
    await user.save();
    return Response.json({ reminded: false });
  }

  user.reminders.push(oid);
  await user.save();
  return Response.json({ reminded: true });
}
