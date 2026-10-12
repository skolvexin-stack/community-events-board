import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyUserToken, tokenFromRequest } from "@/lib/auth";

const VALID = ["Music", "Workshop", "Food", "Sports", "Kids"];

export async function GET(request: NextRequest) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(payload.userId).select("preferences").lean();
  return Response.json({ categories: user?.preferences ?? [] });
}

export async function PUT(request: NextRequest) {
  const token = tokenFromRequest(request);
  const payload = token ? verifyUserToken(token) : null;
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { categories } = body;

  if (!Array.isArray(categories)) {
    return Response.json({ error: "categories must be an array" }, { status: 400 });
  }

  const filtered = (categories as string[]).filter((c) => VALID.includes(c));

  await connectDB();

  await User.findByIdAndUpdate(payload.userId, { preferences: filtered });
  return Response.json({ categories: filtered });
}
