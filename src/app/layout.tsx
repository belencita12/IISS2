import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { clientLinks } from "@/constants/navbar";
import Footer from "@/components/global/Footer";
import NavbarWrapped from "@/components/global/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { headers } from 'next/headers';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NicoPets",
  description: "Servicios y productos para tus mascotas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarWrapped links={clientLinks} />
        {children}
        <Footer />
        <Toaster theme="light" />
        
        {/* Inline script with nonce */}
        <Script
          id="csp-script"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `console.log("CSP con nonce aplicado correctamente")`,
          }}
        />
      </body>
    </html>
  );
}
