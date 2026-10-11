import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { signAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  if (email !== adminEmail || password !== adminPassword) {
    return Response.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const token = signAdminToken({ role: "admin", email });
  return Response.json({ token });
}
