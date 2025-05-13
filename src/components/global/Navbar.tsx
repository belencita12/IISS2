"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";
import { SessionProvider, useSession } from "next-auth/react";
import NavbarSkeleton from "../skeleton/NavbarSkeleton";
import { usePathname } from "next/navigation";

type NavbarProps = {
  links: { label: string; href: string }[];
  isLogged?: boolean;
};

export function Navbar({ links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session && !isLoading;
  const pathname = usePathname();
  const profileActive =
    pathname === "/user-profile" || pathname.startsWith("/user-profile");

  const isAdmin = session?.user?.roles?.includes("ADMIN");

  if (isAdmin) return null;

  if (isLoading) return <NavbarSkeleton />;

  return (
    <header className="w-full shadow-sm px-8 bg-white border-b border-myPurple-disabled/30">
      <div className="w-full flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex items-start gap-2">
          <Link href="/" className="flex items-start gap-2">
            <Image
              src="/logo.png"
              alt="NicoPets logo"
              width={60}
              height={60}
              className="-mt-2"
              priority
            />
            <h1 className="text-lg font-semibold text-myPurple-focus mt-6">
              NicoPets
            </h1>
          </Link>
        </div>

        {/* Links */}
        <div
          className={`flex-1 flex ${
            isAuthenticated ? "justify-center" : "justify-end"
          }`}
        >
          <nav className="hidden md:flex gap-8 items-center">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(link.href) ||
                (link.href === "/user-profile" &&
                  pathname.startsWith("/user-profile"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-myPurple-hover font-semibold"
                      : "text-myPurple-primary hover:text-myPurple-hover"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                key="user-profile"
                href="/user-profile"
                className={`transition-colors duration-200 ${
                  profileActive
                    ? "text-myPurple-hover font-semibold"
                    : "text-myPurple-primary hover:text-myPurple-hover"
                }`}
              >
                Mi Perfil
              </Link>
            )}
          </nav>
        </div>

        {/* Logout */}
        <div className="flex items-center gap-4">
          {isAuthenticated && <LogoutButton />}
          <Button
            variant="ghost"
            className="md:hidden text-myPurple-primary hover:text-myPurple-hover hover:bg-myPurple-disabled/20"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="md:hidden flex flex-col gap-4 items-center bg-white py-4 border-t border-myPurple-disabled/30">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-myPurple-primary hover:text-myPurple-hover transition-colors duration-200 text-lg"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                key="user-profile"
                href="/user-profile"
                className={`transition-colors duration-200 ${
                  profileActive
                    ? "text-myPurple-hover"
                    : "text-myPurple-primary hover:text-myPurple-hover"
                }`}
              >
                Mi Perfil
              </Link>

              <LogoutButton />
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default function NavbarWrapped({ links }: NavbarProps) {
  return (
    <SessionProvider>
      <Navbar links={links} />
    </SessionProvider>
  );
}
