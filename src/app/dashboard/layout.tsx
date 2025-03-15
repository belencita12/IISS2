import SideNav from "@/components/global/SideBar";
import { Header } from "@/components/admin/Header";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import authOptions from '@/lib/auth/options';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "NicoPets",
  description: "Servicios y productos para tus mascotas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-auto sm:max-w-screen md:flex-row">
     
      <div className="w-[20%] md:sticky top-0">
        <SideNav />
      </div>
      <div className="w-[80%] z-10 h-auto xs-pr-3 pr-2 pb-3">
        <Header fullName={session?.user?.fullName} />
        {children}
      </div>
      
    </div>
  );
}
