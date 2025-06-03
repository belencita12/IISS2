"use client"

import Link from "next/link"
import { Shield, Home, ArrowLeft, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signOut } from "next-auth/react"

export default function Unauthorized() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBack = () => {
    if (loading) return
    setLoading(true)
    router.back()
  }

  const handleSignOut = async () => {
    if (loading) return
    setLoading(true)
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#d8b4fe]/20 to-[#f9a8d4]/20 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-myPurple-primary to-myPink-primary p-6 flex justify-center">
          <Shield className="h-14 w-14 text-white" />
        </div>
        
        <div className="p-4 sm:p-6">
          <h1 className="text-8xl font-bold text-center bg-gradient-to-r from-myPurple-primary to-myPink-primary bg-clip-text text-transparent">
            401
          </h1>
          <h2 className="mt-4 text-2xl font-semibold text-center text-gray-800">
            Acceso no autorizado
          </h2>
          <p className="mt-3 text-center text-gray-600">
             Para acceder a este contenido, necesitas iniciar sesión con una cuenta autorizada.
          </p>
          
          <div className="mt-8 space-y-3">
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-myPurple-primary hover:bg-myPurple-hover text-white font-medium rounded-md transition-colors"
            >
              <Home className="h-4 w-4" />
              Ir a la página de inicio
            </Link>
            
            <Button
              disabled={loading}
              onClick={handleBack}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-myPink-primary text-myPink-primary hover:bg-[#fbcfe8]/20 font-medium rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver atrás
            </Button>
            
            <Button
              disabled={loading}
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
        
        <div className="px-6 py-2 bg-[#f9a8d4]/10 border-t border-[#f9a8d4]/30 text-sm text-center text-myPink-focus">
          Si crees que deberías tener acceso, por favor contacta con el administrador.
        </div>
      </div>
    </div>
  )
}