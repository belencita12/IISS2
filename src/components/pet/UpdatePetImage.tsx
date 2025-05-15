"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    "/placeholder.svg";

  return (
    <div className="relative">
      <div className="w-[230px] h-[230px] rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
        {imageToShow ? (
          <Image
            src={imageToShow}
            alt={pet.name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Sin imagen</span>
          </div>
        )}
      </div>

      {showEditButton && (
        <div className="relative">
          <label className="absolute bottom-0 right-0 bg-myPurple-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-myPurple-hover transition-colors duration-200">
            <Camera size={18} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageChange}
              disabled={disabled}
            />
          </label>
        </div>
      )}
    </div>
  );
}