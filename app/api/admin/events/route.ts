import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { verifyAdminToken, tokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = tokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const events = await Event.find().sort({ createdAt: -1 }).lean();
  return Response.json({ events });
}

export async function POST(request: NextRequest) {
  const token = tokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, category, city, dateTime, price, description, imageUrl } = body;

  const required: Record<string, unknown> = { title, category, city, dateTime, description, imageUrl };
  for (const [key, val] of Object.entries(required)) {
    if (!val) {
      return Response.json({ error: `${key} is required` }, { status: 400 });
    }
  }

  const validCategories = ["Music", "Workshop", "Food", "Sports", "Kids"];
  if (!validCategories.includes(category)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  await connectDB();

  const event = await Event.create({
    title,
    category,
    city,
    dateTime: new Date(dateTime),
    price: Math.round(parseFloat(price || "0") * 100),
    description,
    imageUrl,
    isActive: true,
  });

  return Response.json({ event }, { status: 201 });
}
