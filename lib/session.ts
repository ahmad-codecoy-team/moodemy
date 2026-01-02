import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { User, AuthTokenClaims } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface SessionData {
  user: User;
  token: string;
}

/**
 * Create a JWT session token
 */
export function createSessionToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): AuthTokenClaims | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenClaims;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get session from cookies (server-side)
 */
export async function getServerSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  const decoded = verifySessionToken(token);
  if (!decoded) {
    return null;
  }

  return {
    user: {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      isActive: true,
      createdAt: "",
    },
    token,
  };
}

/**
 * Set session cookie (client-side helper)
 */
export function setSessionCookie(token: string) {
  document.cookie = `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${
    7 * 24 * 60 * 60
  }`;
}

/**
 * Clear session cookie
 */
export function clearSessionCookie() {
  document.cookie =
    "admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
