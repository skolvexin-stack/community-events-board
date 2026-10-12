import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User, IUser } from "@/models/User";
import { verifyUserToken, tokenFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;
  if (!mongoose.isValidObjectId(eventId)) {
    return Response.json({ error: "Invalid event ID" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(payload.userId).select("cardDesigns").lean<IUser>();
  const oid = new mongoose.Types.ObjectId(eventId);
  const design = user?.cardDesigns.find((d: IUser["cardDesigns"][0]) => d.eventId.equals(oid)) ?? null;

  return Response.json({ design });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;
  if (!mongoose.isValidObjectId(eventId)) {
    return Response.json({ error: "Invalid event ID" }, { status: 400 });
  }

  const body = await request.json();
  const { theme, stickers } = body;

  const validThemes = ["classic", "dark", "gradient"];
  if (!validThemes.includes(theme)) {
    return Response.json({ error: "Invalid theme" }, { status: 400 });
  }

  const stickerList: string[] = Array.isArray(stickers) ? stickers.slice(0, 3) : [];
  const oid = new mongoose.Types.ObjectId(eventId);

  await connectDB();

  const user = await User.findById(payload.userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const existing = user.cardDesigns.find((d: IUser["cardDesigns"][0]) => d.eventId.equals(oid));
  if (existing) {
    existing.theme = theme;
    existing.stickers = stickerList;
  } else {
    user.cardDesigns.push({ eventId: oid, theme, stickers: stickerList });
  }

  await user.save();
  return Response.json({ design: { eventId, theme, stickers: stickerList } });
}
