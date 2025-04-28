import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
   // 2. 🛡️ Aplicar CSP a TODAS las rutas
   const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

   const csp = `
     default-src 'self';
     connect-src 'self' https://iiss2-backend-production.up.railway.app https://asnavagyfjmrbewjgasb.supabase.co;
     script-src 'self' 'nonce-${nonce}';
     style-src 'self' 'unsafe-inline';
     img-src 'self';
     object-src 'none';
     base-uri 'self';
   `.replace(/\s{2,}/g, ' ').trim();
 
   const requestHeaders = new Headers(req.headers);
   requestHeaders.set('x-nonce', nonce);
 
   const response = NextResponse.next({
     request: { headers: requestHeaders },
   }
   );
 
 
   response.headers.set('Content-Security-Policy', csp);
   response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
   response.headers.set('X-Frame-Options', 'DENY');
   response.headers.set('X-Content-Type-Options', 'nosniff');
   response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
   response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
 
 
  const { pathname } = req.nextUrl;


  // 1. 🔒 Proteger rutas del dashboard
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!token.roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
    }
  }
  return response;

 }

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
