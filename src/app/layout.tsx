import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { clientLinks } from "@/constants/navbar";
import Footer from "@/components/global/Footer";
import { Navbar } from "@/components/global/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { headers } from "next/headers";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import ClientLayout from "@/layout/ClientLayout";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import DynamicFooter from "@/components/global/DynamicFooter";

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
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ClientLayout>
            <Navbar links={clientLinks} />
            {children}
              {/* Agregado del DynamicFooter*/}
            <DynamicFooter session={session} />
            <Toaster theme="light" />

            <Script
              id="csp-script"
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `console.log("CSP con nonce aplicado correctamente")`,
              }}
            />
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}