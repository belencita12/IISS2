"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Button
      onClick={handleLogout}
      variant="default"
      className="bg-myPink-secondary hover:bg-myPink-hover text-white"
      disabled={loading}
    >
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  )
}
