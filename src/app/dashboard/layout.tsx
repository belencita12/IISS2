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
    <div className="flex h-auto flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 md:sticky">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto ">
        {children}
      </div>
    </div>
  );
}
