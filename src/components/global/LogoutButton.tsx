"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import urls from "@/lib/urls";


export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: urls.LOGIN });
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="default"
      disabled={loading}
    >
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  );
}