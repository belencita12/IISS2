import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger todas las rutas bajo `/dashboard`
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  // Verificar el rol del usuario para rutas específicas
  if (pathname.startsWith("/dashboard")) {
    if (!token.roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};