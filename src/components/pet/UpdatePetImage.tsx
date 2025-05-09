"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PetData } from "@/lib/pets/IPet";

interface UpdatePetImageProps {
  pet: PetData;
  previewUrl: string | null;
  showEditButton?: boolean;
  disabled?: boolean;
  onSelectImage: (file: File, url: string) => void;
}

export default function UpdatePetImage({
  pet,
  previewUrl,
  showEditButton = false,
  disabled = false,
  onSelectImage,
}: UpdatePetImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      onSelectImage(file, url);
    };
    reader.readAsDataURL(file);
  };

  const imageToShow =
    previewUrl ||
    pet.profileImg?.originalUrl ||
    pet.profileImg?.previewUrl ||
    null;

  return (
    <div className="flex-col justify-center items-center">
      <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
        {imageToShow ? (
          <Image
            src={imageToShow}
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
            disabled={disabled}
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
