"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";
import { SessionProvider, useSession } from "next-auth/react";
import NavbarSkeleton from "../skeleton/NavbarSkeleton";
import { link } from "fs";
type NavbarProps = {
  links: { label: string; href: string }[];
  isLogged? : boolean;
};

export function Navbar({ links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = !!session && !isLoading;
  console.log(status)

  if(isLoading) return <NavbarSkeleton />

  return (
      <header className="w-full shadow-sm px-8 py-4 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="NicoPets logo"
            width={75}
            height={103}
            priority
          />
          <h1 className="text-xl font-semibold">NicoPets</h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#258084] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          {
            isAuthenticated && (
              <> 
              <Link
              key="user-profile"
              href="/user-profile"
              className="hover:text-[#258084] transition-colors duration-200"
            >Mi Perfil</Link>
                <LogoutButton />
              </>
            )
          }
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="md:hidden flex flex-col gap-4 items-center bg-white py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#258084] transition-colors duration-200 text-lg"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {
            isAuthenticated && (
              <> 
              <Link
              key="user-profile"
              href="/user-profile"
              className="hover:text-[#258084] transition-colors duration-200"
            >Mi Perfil</Link>
                <LogoutButton />
              </>
            )
          }
        </nav>
      )}
    </header>
  );
}

export default function NavbarWrapped ({links}:NavbarProps) {
  return <SessionProvider><Navbar links={links} /></SessionProvider>
}