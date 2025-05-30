"use client";

import { useSession } from "next-auth/react";
import Footer from "./Footer";
import FooterAdmin from "./FooterAdmin";



export default function DynamicFooter() {
  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes("ADMIN")

  return isAdmin ? <FooterAdmin /> : <Footer />;
} 