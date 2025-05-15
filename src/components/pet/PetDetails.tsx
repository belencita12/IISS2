"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import PetVaccinationTable from "../pet/PetVaccinationTable"
import type { PetData } from "@/lib/pets/IPet"
import { getPetById } from "@/lib/pets/getPetById"
import { toast } from "@/lib/toast"
import { formatDate } from "@/lib/utils"
import AppointmentList from "@/components/pet/AppointmentList"
import { updatePet } from "@/lib/pets/updatePet"
import UpdatePetImage from "@/components/pet/UpdatePetImage"
import PetDetailsSkeleton from "./skeleton/PetDetailsskeleton"
import { Calendar, CircleDot, Edit, PawPrintIcon as Paw, Save, Scale, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  token: string
}

function calcularEdad(fechaNacimiento: string): string {
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  let meses = 0

  const agediff = hoy.getUTCFullYear() - nacimiento.getUTCFullYear()
  let edad = agediff
  const mesNacimiento = nacimiento.getUTCMonth()
  const diaNacimiento = nacimiento.getUTCDate()
  const mesActual = hoy.getUTCMonth()
  const diaActual = hoy.getUTCDate()

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
    edad--
  }

  if (edad < 1) {
    if (agediff > 0) {
      meses = 12 + mesActual - mesNacimiento
    } else {
      meses = mesActual - mesNacimiento
    }
    if (meses === 1) {
      return `${meses} Mes`
    } else {
      return `${meses} Meses`
    }
  }

  if (edad === 1) {
    return `${edad} Año`
  }
  return `${edad} Años`
}

export default function PetDetails({ token }: Props) {
  const { id } = useParams();
  const [pet, setPet] = useState<PetData | null | undefined>(undefined);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [activeSubTab, setActiveSubTab] = useState("vacunas");

  const handleSelectImage = (file: File, url: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleCancel = () => {
    setIsEditingName(false);
    setEditedName(pet?.name ?? "");
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    setPet(undefined);
    getPetById(Number(id), token)
      .then((data) => {
        setPet(data);
        setEditedName(data?.name ?? "");
      })
      .catch(() => {
        toast("error", "Error al obtener la mascota.");
        setPet(null);
      });
  }, [id, token]);

  const handleSave = async () => {
    if (!editedName.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (!pet || pet.id === undefined) {
      setError("No se puede actualizar, la mascota no tiene ID.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", editedName);
      if (selectedFile) {
        formData.append("profileImg", selectedFile);
      }
      const updatedPet = await updatePet(pet.id, formData, token);
      if (!updatedPet || !updatedPet.id) {
        throw new Error("Respuesta inválida de la API");
      }
      setPet(updatedPet);
      setIsEditingName(false);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      toast("success", "Mascota actualizada correctamente");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al guardar los cambios");
      }
      toast("error", "Error al actualizar la mascota");
    } finally {
      setIsSaving(false);
    }
  };

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
          icon: <Scale className="h-4 w-4" />,
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
          value: pet.sex || "No especificado",
          icon: <CircleDot className="h-4 w-4" />,
        },
      ]
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-myPurple-disabled/20">
      {pet === undefined ? (
        <PetDetailsSkeleton />
      ) : pet === null ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">No se encontró la mascota</p>
        </div>
      ) : (
        <>
          <div className="relative">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-myPurple-primary to-myPink-primary h-48 shadow-md">
              {" "}
            </div>

            {/* Tarjeta principal */}
            <div className="container mx-auto px-4">
              <Card className="mt-[-80px] shadow-xl border-none overflow-visible">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Sección de imagen y nombre */}
                    <div className="w-full md:w-1/3 p-6 flex flex-col items-center">
                      <div className="relative mb-4 mt-[-50px]">
                        <div className="rounded-full p-1 bg-white shadow-lg">
                          {isEditingName ? (
                            <UpdatePetImage
                              pet={pet}
                              previewUrl={previewUrl}
                              disabled={isSaving}
                              showEditButton={isEditingName}
                              onSelectImage={handleSelectImage}
                            />
                          ) : (
                            <div className="rounded-full overflow-hidden w-[250px] h-[250px]">
                              <Image
                                src={
                                  pet.profileImg?.originalUrl ||
                                  "/NotImageNicoPets.png"
                                }
                                alt={pet.name}
                                width={250}
                                height={250}
                                className="object-cover w-full h-full"
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
                            className="w-full flex flex-col items-center gap-2"
                          >
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="text-xl font-bold text-center border-b-2 border-myPurple-primary bg-transparent focus:outline-none focus:border-myPink-primary w-full px-2 py-1"
                              disabled={isSaving} // <--- bloquear input mientras guarda
                            />
                            {/* Edad siempre visible */}
                            <Badge className="bg-gradient-to-r from-myPurple-secondary to-myPink-secondary mb-2">
                              {calcularEdad(pet.dateOfBirth)}
                            </Badge>
                            {error && (
                              <p className="text-destructive text-sm">
                                {error}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                size="sm"
                                className="bg-myPurple-primary hover:bg-myPurple-hover"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                {isSaving ? "Guardando..." : "Guardar"}
                              </Button>
                              <Button
                                onClick={handleCancel}
                                variant="outline"
                                size="sm"
                                disabled={isSaving}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancelar
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
                            <h2 className="text-2xl font-bold text-myPurple-primary mb-1">
                              {pet.name}
                            </h2>

                            {/* Edad */}
                            <Badge className="bg-gradient-to-r from-myPurple-secondary to-myPink-secondary mb-2">
                              {calcularEdad(pet.dateOfBirth)}
                            </Badge>

                            <Button
                              onClick={() => setIsEditingName(true)}
                              variant="ghost"
                              size="lg"
                              className="text-myPurple-primary hover:text-myPurple-hover hover:bg-myPurple-disabled/20 border"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sección de información y tabs */}
                    <div className="w-full md:w-2/3 p-6">
                      <Tabs
                        defaultValue="info"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsContent value="info" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {petInfoItems.map((item, index) => (
                              <Card
                                key={index}
                                className="border border-myPurple-disabled/50 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-1 text-myPurple-primary">
                                    {item.icon}
                                    <span className="text-sm font-medium">
                                      {item.label}
                                    </span>
                                  </div>
                                  <p className="text-lg font-semibold">
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

          {/* Sección de vacunas y citas con pestañas */}
          {pet?.id && activeTab === "info" && (
            <div className="w-full px-4 py-4">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <Tabs
                    defaultValue="vacunas"
                    value={activeSubTab}
                    onValueChange={setActiveSubTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger
                        value="vacunas"
                        className="data-[state=active]:bg-myPurple-primary data-[state=active]:text-white"
                      >
                        Vacunas
                      </TabsTrigger>
                      <TabsTrigger
                        value="citas"
                        className="data-[state=active]:bg-myPink-primary data-[state=active]:text-white"
                      >
                        Citas
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="vacunas" className="mt-0">
                      <PetVaccinationTable
                        Id={Number(id)}
                        token={token}
                        petId={pet.id}
                      />
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
  );
}