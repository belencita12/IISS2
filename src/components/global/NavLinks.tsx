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
  CalendarIcon,
} from "lucide-react";

const linksUser = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Citas", href: "/dashboard/citas", icon: CalendarIcon },
  { name: "Clientes", href: "/dashboard/clients", icon: UserIcon },
  { name: "Productos", href: "/dashboard/products", icon: BoneIcon },  
  { name: "Vacunas", href: "/dashboard/vaccine", icon: SyringeIcon },
  { name: "Depositos", href: "/dashboard/stock", icon: StoreIcon },
  { name: "Movimientos", href: "/dashboard/movements", icon: BoxIcon },
  { name: "Compras", href: "/dashboard/compras", icon: CircleDollarSignIcon },
  { name: "Crear Venta", href: "/dashboard/ventas", icon: HandCoinsIcon },
  { name: "Empleados", href: "/dashboard/employee", icon: BookUserIcon },
  { name: "Facturas", href: "/dashboard/facturas", icon: FileIcon },
  {
    name: "Configuración",
    href: "/dashboard/settings",
    icon: SettingsIcon,
  },
  { name: "Ayuda", href: "/dashboard/ayuda", icon: CircleHelpIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {linksUser.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href; // Verifica si la ruta actual coincide

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
