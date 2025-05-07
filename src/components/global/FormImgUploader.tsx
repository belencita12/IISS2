import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormImgUploaderProps {
  onChange: (file: File | undefined) => void;
  error?: string;
  prevClassName?: string;
  prevWidth?: number;
  defaultImage?: string | null;
}

const FormImgUploader = ({
  onChange,
  error,
  prevClassName,
  prevWidth = 256,
  defaultImage,
}: FormImgUploaderProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(defaultImage || null);

  useEffect(() => {
    setPreviewImage(defaultImage || null);
  }, [defaultImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      onChange(undefined);
      setPreviewImage(defaultImage || null);
      return;
    }

    onChange(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      <Label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium text-center cursor-pointer">
        <Input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
        {previewImage ? "Cambiar imagen" : "Subir imagen"}
      </Label>

      {(previewImage || defaultImage) && (
        <div className="w-full flex justify-center mt-4">
          <Image
            src={previewImage || defaultImage || ""}
            className={prevClassName}
            alt="Vista previa de la imagen"
            width={prevWidth}
            height={prevWidth}
            quality={100}
            priority
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormImgUploader;
