"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BoneIcon,
  SyringeIcon,
  StoreIcon,
  UserIcon,
  BoxIcon,
  CircleDollarSignIcon,
  HandCoinsIcon,
  BookUserIcon,
  FileIcon,
  SettingsIcon,
  CircleHelpIcon,
} from "lucide-react";
import urls from "@/lib/urls"; 

const linksUser = [
{ name: "Dashboard", href: urls.DASHBOARD, icon: HomeIcon },
{ name: "Citas", href: urls.DASHBOARD_CITAS, icon: UserIcon },
{ name: "Productos", href: urls.DASHBOARD_PRODUCTOS, icon: BoneIcon },
{ name: "Vacunas", href: urls.DASHBOARD_VACUNAS, icon: SyringeIcon },
{ name: "Depositos", href: urls.DASHBOARD_DEPOSITOS, icon: StoreIcon },
{ name: "Movimientos", href: urls.DASHBOARD_MOVIMIENTOS, icon: BoxIcon },
{ name: "Compras", href: urls.DASHBOARD_COMPRAS, icon: CircleDollarSignIcon },
{ name: "Crear Venta", href: urls.DASHBOARD_VENTAS, icon: HandCoinsIcon },
{ name: "Empleados", href: urls.DASHBOARD_EMPLEADOS, icon: BookUserIcon },
{ name: "Facturas", href: urls.DASHBOARD_FACTURAS, icon: FileIcon },
{ name: "Configuración", href: urls.DASHBOARD_CONFIGURACION, icon: SettingsIcon },
{ name: "Ayuda", href: urls.DASHBOARD_AYUDA, icon: CircleHelpIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {linksUser.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href; 

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3
              ${isActive ? "text-black" : "text-[#757575] hover:text-[#258084]"}
              ${link.name === "Ayuda" ? "mt-6" : ""}
            `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
