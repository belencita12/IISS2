"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
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
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => onSelectImage(file, reader.result as string);
    reader.readAsDataURL(file);
  };

  const src =
    previewUrl ||
    pet.profileImg?.originalUrl ||
    pet.profileImg?.previewUrl ||
    "/placeholder.svg";

  return (
    <div className="relative w-full h-full overflow-visible">
      <div className="rounded-full overflow-hidden border-4 border-white shadow-md bg-white w-full h-full">
        <Image
          src={src}
          alt={pet.name}
          width={250}
          height={250}
          className="object-cover w-full h-full"
        />
      </div>

      {showEditButton && (
        <label className="absolute bottom-2 right-2 z-10 block bg-myPurple-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-myPurple-hover transition-colors">
          <Camera size={18} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}