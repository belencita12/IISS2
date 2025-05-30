import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

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
  prevWidth = 160,
  defaultImage,
}: FormImgUploaderProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(defaultImage || null);
  const t = useTranslations();

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
    <div className="w-full flex flex-col items-center">
      <div className="relative w-40 h-40 mb-4">
  {previewImage ? (
    <Image
      src={previewImage}
      alt="Vista previa"
      width={prevWidth}
      height={prevWidth}
      className={`object-cover shadow-lg border-2 border-gray-200 ${prevClassName || ""}`}
    />
  ) : (
    <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
      {t("error.noImage")}
    </div>
  )}
</div>

      <Label className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors duration-200">
        <Input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
        {previewImage ? t("button.change") : t("button.upload")}
      </Label>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FormImgUploader;
