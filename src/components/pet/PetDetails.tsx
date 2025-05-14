"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import PetVaccinationTable from "../pet/PetVaccinationTable";
import { PetData } from "@/lib/pets/IPet";
import { getPetById } from "@/lib/pets/getPetById";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import AppointmentList from "@/components/appointment/AppointmentList";
import { updatePet } from "@/lib/pets/updatePet";
import UpdatePetImage from "@/components/pet/UpdatePetImage";
import { useTranslations } from "next-intl";
import PetDetailsSkeleton from "./skeleton/PetDetailsskeleton";


interface Props {
  token: string;
}

function calcularEdad(fechaNacimiento: string): string {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses = 0;

  const agediff = hoy.getUTCFullYear() - nacimiento.getUTCFullYear();
  let edad = agediff;
  const mesNacimiento = nacimiento.getUTCMonth();
  const diaNacimiento = nacimiento.getUTCDate();
  const mesActual = hoy.getUTCMonth();
  const diaActual = hoy.getUTCDate();

  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }

  if (edad < 1) {
    if (agediff > 0) {
      meses = 12 + mesActual - mesNacimiento;
    } else {
      meses = mesActual - mesNacimiento;
    }
    if (meses === 1) {
      return `${meses} Mes`;
    } else {
      return `${meses} Meses`;
    }
  }

  if (edad === 1) {
    return `${edad} Año`;
  }
  return `${edad} Años`;
}

export default function PetDetails({ token }: Props) {
  const b = useTranslations("Button");
  const p = useTranslations("PetDetail");
  const v = useTranslations("Vaccune");
  const e = useTranslations("Error");

  const { id } = useParams();
  const [pet, setPet] = useState<PetData | null | undefined>(undefined);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(e("noSave"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-col">
      {pet === undefined ? (
        <PetDetailsSkeleton />
      ) : pet === null ? (
        <></>
      ) : (
        <>
          <div className="flex justify-center bg-gray-500 p-5">
            <div className="flex-col justify-center items-center p-3 pr-8">
              <UpdatePetImage
                pet={pet}
                previewUrl={previewUrl}
                disabled={isSaving}
                showEditButton={isEditingName}
                onSelectImage={handleSelectImage}
              />
              <div className="flex-col p-2 text-black">
                <p className="flex justify-center font-bold">{pet.name}</p>
                <p className="flex justify-center font-bold text-xl">
                  {calcularEdad(pet.dateOfBirth)}
                </p>
              </div>
            </div>

            <div className="flex-col justify-start text-white text-xs">
              {[
                { label: p("name"), name: "name" },
                { label: p("born"), name: "dateOfBirth" },
                { label: p("weight"), name: "weight" },
                { label: p("race"), name: "race" },
                { label: p("specie"), name: "species" },
                { label: p("sex"), name: "sex" },
              ].map(({ label, name }) => (
                <div key={name} className="p-1 pb-3">
                  <p>{label}</p>
                  {name === "name" && isEditingName ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-black w-full border border-gray-300 rounded p-1"
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xl">
                      {name === "dateOfBirth"
                        ? formatDate(pet.dateOfBirth)
                        : name === "race"
                        ? pet.race?.name
                        : name === "species"
                        ? pet.species?.name
                        : name === "weight"
                        ? `${pet.weight} kg`
                        : String(pet[name as keyof PetData])}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                {isEditingName ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`p-1 pl-3 pr-3 ${
                        isSaving ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {isSaving ? b("saving") : b("save")}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="p-1 pl-3 pr-3"
                      disabled={isSaving}
                    >
                      {b("cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 pl-3 pr-3"
                  >
                    {b("edit")}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex-col md:px-28 md:py-10 bg-white">
            {pet?.id && <AppointmentList token={token} petId={pet.id} />}

            {pet?.id && (
              <>
                <h2 className="text-2xl font-bold mb-3 mt-10">
                  {v("vaccuneControlTitle")}
                </h2>
                <PetVaccinationTable
                  Id={Number(id)}
                  token={token}
                  petId={pet.id}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
