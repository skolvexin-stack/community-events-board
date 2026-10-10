import jwt from "jsonwebtoken";

const USER_SECRET = process.env.JWT_SECRET!;
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET!;

export interface UserPayload {
  userId: string;
  email: string;
}

export interface AdminPayload {
  role: "admin";
  email: string;
}

export function signUserToken(payload: UserPayload): string {
  return jwt.sign(payload, USER_SECRET, { expiresIn: "7d" });
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, USER_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, ADMIN_SECRET, { expiresIn: "8h" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, ADMIN_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export function tokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}
