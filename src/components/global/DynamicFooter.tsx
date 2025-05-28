"use client";

import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Footer from "./Footer";
import FooterAdmin from "./FooterAdmin";

interface Props {
  session: Session | null;
}

export default function DynamicFooter({ session: initialSession }: Props) {
  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes("ADMIN") || 
                 initialSession?.user?.roles?.includes("ADMIN");

  return isAdmin ? <FooterAdmin /> : <Footer />;
} 