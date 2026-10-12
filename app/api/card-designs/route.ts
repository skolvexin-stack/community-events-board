import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyUserToken, tokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ designs: [] });
  }

  await connectDB();

  const user = await User.findById(payload.userId).select("cardDesigns").lean();
  const designs: Record<string, { theme: string; stickers: string[] }> = {};

  for (const d of user?.cardDesigns ?? []) {
    designs[d.eventId.toString()] = { theme: d.theme, stickers: d.stickers };
  }

  return Response.json({ designs });
}
