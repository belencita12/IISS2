"use client";
import { PowerIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
export default function SignOutButton() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    }
    catch (error) {
      const errorMessage = (error as Error).message || "Error al cerrar sesión";
      setMessage(errorMessage);
    }
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
