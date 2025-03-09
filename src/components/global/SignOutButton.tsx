"use client";
import { PowerIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import urls from "@/lib/urls"; 

export default function SignOutButton() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    console.log("logout");
    setMessage("");
  };

  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    await logout();
    router.push(urls.LOGIN); 
  };

  return (
    <button
      onClick={handleLogout}
      className="flex text-red-500  hover:text-black h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">
        {loading ? "Cerrando sesión..." : "Cerrar sesión"}
      </div>
      {message && (
        <div className="flex items-center gap-2 text-red-500">
          <LogOutIcon className="w-4" />
          <span>{message}</span>
        </div>
      )}
    </button>
  );
}
