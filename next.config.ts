import type { NextConfig } from "next";

const securityHeaders = [
  {
<<<<<<< HEAD
    key: "Content-Security-Policy",
    value: "default-src 'self'; connect-src 'self' https://iiss2-backend-production.up.railway.app; img-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';",
  },
  {
=======
>>>>>>> 53e67935b693105e560d53abea21e63afcb9d588
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer-when-downgrade",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), camera=(), microphone=()",
  },
  {
    key: "X-Powered-By",
    value: "",
  },
  {
    key: "Server",
    value: "",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
