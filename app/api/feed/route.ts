import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { verifyUserToken, tokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(payload.userId).select("preferences").lean();
  if (!user || user.preferences.length === 0) {
    return Response.json({ events: [], message: "No favourite categories set" });
  }

  const events = await Event.find({
    isActive: true,
    dateTime: { $gt: new Date() },
    category: { $in: user.preferences },
  })
    .sort({ dateTime: 1 })
    .select("title category city dateTime price description imageUrl")
    .lean();

  return Response.json({ events });
}
