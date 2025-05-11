import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const csp = `
  default-src 'self';
  connect-src 'self' https://iiss2-backend-production.up.railway.app https://iiss2-backend-0q2e.onrender.com https://asnavagyfjmrbewjgasb.supabase.co;
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://asnavagyfjmrbewjgasb.supabase.co;
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, " ").trim();


const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  {
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

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
