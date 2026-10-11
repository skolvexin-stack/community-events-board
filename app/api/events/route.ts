import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const city = searchParams.get("city") || undefined;
  const q = searchParams.get("q") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  await connectDB();

  const filter: Record<string, unknown> = {
    isActive: true,
    dateTime: { $gt: new Date() },
  };

  if (category) filter.category = category;
  if (city) filter.city = city;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort({ dateTime: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .select("title category city dateTime price description imageUrl isActive")
      .lean(),
    Event.countDocuments(filter),
  ]);

  return Response.json({
    events,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
}
