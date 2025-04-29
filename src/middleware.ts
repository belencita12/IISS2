import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!token.roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
    }
  }
 }

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
