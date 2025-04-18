import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger todas las rutas bajo `/dashboard` sdfasdfasdf
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verificar el rol del usuario para rutas específicas
  if (pathname.startsWith("/dashboard")) {
    console.log("Checking role for", pathname);
    if (!token.roles.includes("ADMIN")) {
      console.log("Unauthorized access to", pathname);
      return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};