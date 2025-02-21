import { Input } from "@/components/ui/input";
import { Menubar, MenubarMenu, MenubarTrigger } from "@radix-ui/react-menubar";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
  links: { label: string; href: string }[];
};

export default function Navbar({ links }: NavbarProps) {
  return (
    <Menubar className="flex justify-between items-center w-full mx-auto flex-wrap">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="NicoPets logo"
          width={75}
          height={103}
          priority
        />
        <h1 className="text-xl font-semibold">NicoPets</h1>
      </div>
      <MenubarMenu>
        <nav className="flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              passHref
              className="hover:text-[#258084] transition-colors duration-200"
            >
              <MenubarTrigger>{link.label}</MenubarTrigger>
            </Link>
          ))}
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar..."
              className="pr-8 appearance-none"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </nav>
      </MenubarMenu>
    </Menubar>
  );
}
