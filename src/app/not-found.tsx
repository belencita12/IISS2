"use client"

import Link from "next/link"
import { AlertTriangle, Home, ArrowLeft, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#d8b4fe]/20 to-[#f9a8d4]/20 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] p-6 flex justify-center">
          <AlertTriangle className="h-14 w-14 text-white" />
        </div>

        <div className="p-4 sm:p-6">
          <h1 className="text-8xl font-bold text-center bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-center text-gray-800">Página no encontrada</h2>

          <p className="mt-3 text-center text-gray-600">Lo sentimos, no pudimos encontrar el recurso solicitado.</p>

          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#a855f7] hover:bg-[#9333ea] text-white font-medium rounded-md transition-colors"
            >
              <Home className="h-4 w-4" />
              Ir a la página de inicio
            </Link>

            <Button 
            onClick={() => router.back()} 
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-[#ec4899] text-[#ec4899] hover:bg-[#fbcfe8]/20 font-medium rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver atrás
            </Button>

            <Button
              onClick={() => router.refresh()}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-[#d8b4fe] text-[#a855f7] hover:bg-[#e9d5ff]/30 font-medium rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
          </div>
        </div>

        <div className="px-6 py-2 bg-[#f9a8d4]/10 border-t border-[#f9a8d4]/30 text-sm text-center text-[#be185d]">
          Si crees que esto es un error, por favor contacta con soporte.
        </div>
      </div>
    </div>
  )
}
