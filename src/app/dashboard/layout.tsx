import SideNav from "@/components/global/SideBar";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "NicoPets",
  description: "Servicios y productos para tus mascotas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-auto sm:max-w-screen md:flex-row ">
      <div className="w-[20%] md:sticky top-0">
        <SideNav />
      </div>
      <div className="w-[80%] h-auto pr-2 pb-3">
        {children}
      </div>
    </div>
  );
}
