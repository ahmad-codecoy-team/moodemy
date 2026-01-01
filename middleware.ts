import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  if (pathname.startsWith("/admin")) {
    // Check for admin token in cookies or headers
    const token =
      request.cookies.get("admin_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    // If no token, redirect to login (except for the login page itself)
    if (!token && pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check if this is an API route that needs authentication
  if (pathname.startsWith("/api/admin")) {
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
