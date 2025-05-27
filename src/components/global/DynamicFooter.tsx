"use client";

import { useSession } from "next-auth/react";
import Footer from "./Footer";
import FooterAdmin from "./FooterAdmin";

interface Props {
  session: any;
}

export default function DynamicFooter({ session: initialSession }: Props) {
  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes("ADMIN") || 
                 initialSession?.user?.roles?.includes("ADMIN");

  return isAdmin ? <FooterAdmin /> : <Footer />;
} 