"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { updatePet } from "@/lib/pets/updatePet";
import { toast } from "@/lib/toast";
import { PetData } from "@/lib/pets/IPet";

interface UpdatePetImageProps {
  pet: PetData;
  token: string;
  onImageUpdate: (updatedPet: PetData) => void;
  showEditButton?: boolean;
}

export default function UpdatePetImage({ 
  pet, 
  token, 
  onImageUpdate,
  showEditButton = false 
}: UpdatePetImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pet?.id || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImg", file);

    try {
      const updatedPet = await updatePet(pet.id, formData, token);
      if (!updatedPet || !updatedPet.id) {
        throw new Error("No se pudo actualizar la imagen");
      }
      onImageUpdate(updatedPet);
      toast("success", "Imagen actualizada correctamente");
    } catch (error) {
      toast("error", "Error al actualizar la imagen");
    }
  };

  return (
    <div className="flex-col justify-center items-center">
      <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
        {pet.profileImg?.originalUrl || pet.profileImg?.previewUrl ? (
          <Image
            src={pet.profileImg.originalUrl || pet.profileImg.previewUrl}
            alt={pet.name}
            width={100}
            height={100}
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 mx-auto flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
      </div>
      
      {showEditButton && (
        <div className="flex flex-col items-center mt-2 mb-2">
          <Button
            type="button"
            className="rounded-md p-2 shadow-md flex items-center gap-2 text-sm font-medium transition"
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar foto de perfil"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Cambiar foto de perfil
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      )}
    </div>
  );
}