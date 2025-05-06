"use client"

import { useState, useEffect } from "react"
import type { IUserProfile } from "@/lib/client/IUserProfile"
import { getAuth } from "./getAuth"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserCircle, Mail, Phone, MapPin, Building2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileUserProps {
  clientId: number
  token: string
}

export function ProfileUser({ clientId, token }: ProfileUserProps) {
  const [userData, setUserData] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const authData = await getAuth(token)
        setUserData(authData)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos del usuario")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [token])

  if (loading) {
    return (
      <div className="w-full p-0">
        <Card className="rounded-none border-x-0">
          <CardHeader className="pb-0">
            <div className="flex justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-0">
        <Card className="border-red-200 bg-red-50 rounded-none border-x-0">
          <CardContent className="pt-6">
            <div className="py-8 text-center text-red-500 flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <UserCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="font-medium">{error}</p>
              <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                Intentar nuevamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="w-full p-0">
        <Card className="rounded-none border-x-0">
          <CardContent className="pt-6">
            <div className="py-8 text-center text-gray-500 flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <UserCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium">No se encontraron datos del usuario</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full p-0">
      <Card className="overflow-hidden rounded-none border-x-0">
        {/* Header with simple background - no gradient */}
        <div className="relative h-28 bg-gray-50 border-b">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
              <img
                src={userData.image?.originalUrl || "/blank-profile-picture-973460_1280.png"}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-20 pb-8 px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{userData.fullName}</h2>
          </div>

          <div className="flex justify-center mb-8">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar perfil
            </Button>
          </div>

          <div className="h-px w-full bg-gray-200 my-8"></div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-24 lg:gap-x-36">
            {/* Email */}
            <div className="flex items-start gap-4 md:pl-2 lg:pl-4">
              <div className="rounded-full bg-violet-100 p-2 mt-0.5 flex-shrink-0">
                <Mail className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{userData.email}</p>
              </div>
            </div>

            {/* Teléfono (movido más a la derecha) */}
            <div className="flex items-start gap-4 md:pl-8 lg:pl-16">
              <div className="rounded-full bg-violet-100 p-2 mt-0.5 flex-shrink-0">
                <Phone className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-800">{userData.phoneNumber || "No especificado"}</p>
              </div>
            </div>

            {/* Dirección */}
            <div className="flex items-start gap-4 md:pl-4 lg:pl-8">
              <div className="rounded-full bg-violet-100 p-2 mt-0.5 flex-shrink-0">
                <MapPin className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="font-medium text-gray-800">{userData.adress || "No especificada"}</p>
              </div>
            </div>

            {/* RUC (movido más a la derecha) */}
            <div className="flex items-start gap-4 md:pl-8 lg:pl-16">
              <div className="rounded-full bg-violet-100 p-2 mt-0.5 flex-shrink-0">
                <Building2 className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">RUC</p>
                <p className="font-medium text-gray-800">{userData.ruc || "No especificado"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
