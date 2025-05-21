"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import PetVaccinationTable from "../pet/PetVaccinationTable"
import type { PetData } from "@/lib/pets/IPet"
import { getPetById } from "@/lib/pets/getPetById"
import { toast } from "@/lib/toast"
import { formatDate } from "@/lib/utils"
import AppointmentList from "@/components/pet/AppointmentList"
import { updatePet } from "@/lib/pets/updatePet"
import UpdatePetImage from "@/components/pet/UpdatePetImage"
import PetDetailsSkeleton from "./skeleton/PetDetailsskeleton"
import { ArrowLeft, Calendar, CircleDot, Edit, PawPrintIcon as Paw, Scale, Weight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { calcularEdad } from "@/lib/utils"
import { useTranslations } from "next-intl";


interface Props {
  token: string
}

export default function PetDetails({ token }: Props) {
  const { id } = useParams()
  const [pet, setPet] = useState<PetData | null | undefined>(undefined)
  const router = useRouter()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("info")
  const [activeSubTab, setActiveSubTab] = useState("vacunas")
  const b = useTranslations("Button");
  const p = useTranslations("PetDetail");
  const v = useTranslations("Vaccune");
  const e = useTranslations("Error");

  const handleSelectImage = (file: File, url: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(url)
  }

  const handleCancel = () => {
    setIsEditingName(false)
    setEditedName(pet?.name ?? "")
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
  }

  useEffect(() => {
    setPet(undefined)
    getPetById(Number(id), token)
      .then((data) => {
        setPet(data)
        setEditedName(data?.name ?? "")
      })
      .catch((error: unknown) => {
        toast("error", error instanceof Error ? error.message : e("error"));
        setPet(null);
      });
  }, [id, token]);

  const handleSave = async () => {
    if (!editedName.trim()) {
      setError(e("noEmpty"));
      return;
    }
    if (!pet || pet.id === undefined) {
      setError(e("noUpdate"));
      return;
    }
    setIsSaving(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("name", editedName)
      if (selectedFile) {
        formData.append("profileImg", selectedFile)
      }
      const updatedPet = await updatePet(pet.id, formData, token)
      if (!updatedPet || !updatedPet.id) {
        throw new Error("Respuesta inválida de la API")
      }
      setPet(updatedPet)
      setIsEditingName(false)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setSelectedFile(null)
      toast("success", "Mascota actualizada correctamente")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(e("noSave"));
      }
      toast("error", "Error al actualizar la mascota")
    } finally {
      setIsSaving(false)
    }
  }

  const petInfoItems = pet
    ? [
        {
          label: "Fecha de Nacimiento",
          value: formatDate(pet.dateOfBirth),
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          label: "Peso",
          value: `${pet.weight} kg`,
          icon: <Weight className="h-4 w-4" />,
        },
        {
          label: "Raza",
          value: pet.race?.name || "No especificada",
          icon: <Paw className="h-4 w-4" />,
        },
        {
          label: "Especie",
          value: pet.species?.name || "No especificada",
          icon: <Paw className="h-4 w-4" />,
        },
        {
          label: "Género",
          value:
            pet.sex === "F"
              ? "Hembra"
              : pet.sex === "M"
              ? "Macho"
              : "No especificado",
          icon: <CircleDot className="h-4 w-4" />,
        },
      ]
    : []

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-purple-50">
      {pet === undefined ? (
        <PetDetailsSkeleton />
      ) : pet === null ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">No se encontró la mascota</p>
        </div>
      ) : (
        <>
          <div className="relative">
            {/* Header*/}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-40 sm:h-48 shadow-md" />

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-purple-600 hover:bg-white hover:text-pink-500 transition-all duration-300 shadow-sm border-purple-200 flex items-center gap-2 rounded-full px-3 py-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver</span>
            </Button>

            {/* Tarjeta principal */}
            <div className="container mx-auto px-4">
              <Card className="mt-[-70px] sm:mt-[-80px] shadow-xl border-none overflow-visible">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Sección de imagen y nombre */}
                    <div className="w-full md:w-1/3 p-4 sm:p-6 flex flex-col items-center">
                      <div className="relative mb-4 mt-[-40px] sm:mt-[-50px] flex justify-center w-full">
                        <div className="rounded-full p-1.5 bg-white shadow-lg relative">
                          {isEditingName ? (
                            <div className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[250px] md:h-[250px]">
                              <UpdatePetImage
                                pet={pet}
                                previewUrl={previewUrl}
                                disabled={isSaving}
                                showEditButton
                                onSelectImage={handleSelectImage}
                              />
                            </div>
                          ) : (
                            <div className="rounded-full overflow-hidden w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[250px] md:h-[250px] ring-4 ring-purple-100">
                              <Image
                                src={pet.profileImg?.originalUrl || "/NotImageNicoPets.png"}
                                alt={pet.name}
                                width={250}
                                height={250}
                                className="object-cover w-full h-full"
                                sizes="(max-width: 640px) 120px, (max-width: 768px) 180px, 250px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <AnimatePresence mode="wait">
                        {isEditingName ? (
                          <motion.div
                            key="editing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full flex flex-col items-center gap-2 px-2"
                          >
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="text-lg sm:text-xl font-bold text-center border-b-2 border-purple-500 bg-transparent focus:outline-none focus:border-pink-500 w-full px-2 py-1"
                              disabled={isSaving}
                            />
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 mb-3">
                              {calcularEdad(pet.dateOfBirth)}
                            </Badge>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full justify-center">
                              <Button
                                onClick={handleCancel}
                                variant="outline"
                                size="sm"
                                disabled={isSaving}
                                className="border-myPurple-tertiary text-myPurple-primary hover:bg-myPurple-disabled hover:text-myPurple-focus transition-all duration-200"
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                size="sm"
                                className="bg-gradient-to-r from-myPurple-primary to-myPink-primary hover:from-myPurple-hover hover:to-myPink-hover text-white transition-all duration-200"
                              >
                                {isSaving ? "Editando..." : "Editar"}
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="display"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center text-center"
                          >
                            <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-1">{pet.name}</h2>

                            <Badge className="bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 mb-3">
                              {calcularEdad(pet.dateOfBirth)}
                            </Badge>
                            <Button
                              onClick={() => setIsEditingName(true)}
                              variant="ghost"
                              className="px-3 py-1 h-auto text-xs bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 hover:text-white"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sección de información - centrada en móvil */}
                    <div className="w-full md:w-2/3 p-4 sm:p-6">
                      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsContent value="info" className="mt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto max-w-md md:max-w-none">
                            {petInfoItems.map((item, index) => (
                              <Card
                                key={index}
                                className="border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1 text-purple-600">
                                    {item.icon}
                                    <span className="text-sm font-medium">{item.label}</span>
                                  </div>
                                  <p className="text-base sm:text-lg font-semibold text-gray-800 text-center md:text-left">
                                    {item.value}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sección de vacunas y citas */}
          {pet?.id && activeTab === "info" && (
            <div className="w-full px-4 py-6">
              <Card className="border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <Tabs defaultValue="vacunas" value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6 bg-purple-50 rounded-md overflow-hidden">
                      <TabsTrigger
                        value="vacunas"
                        className="bg-gray-200 text-gray-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        Control de Vacunas
                      </TabsTrigger>
                      <TabsTrigger
                        value="citas"
                        className="bg-gray-200 text-gray-700 data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                      >
                        Citas
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="vacunas" className="mt-0">
                      <PetVaccinationTable Id={Number(id)} token={token} petId={pet.id} />
                    </TabsContent>
                    <TabsContent value="citas" className="mt-0">
                      <AppointmentList token={token} petId={pet.id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}