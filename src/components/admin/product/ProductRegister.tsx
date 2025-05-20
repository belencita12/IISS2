"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NumericInput from "@/components/global/NumericInput";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { registerProduct } from "@/lib/products/registerProduct";
import { useRouter } from "next/navigation";
import { TagFilter } from "./filter/TagFilter";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useInitialData } from "@/hooks/purchases/useProviderStock";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const productFormSchema = z.object({
  productName: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  cost: z
    .number({ message: "Complete con valores numéricos adecuados" })
    .min(1, "El costo debe ser mayor a 0"),
  price: z
    .number({ message: "Complete con valores numéricos adecuados" })
    .min(1, "El precio debe ser mayor a 0"),
  iva: z
    .number({ message: "Complete con valores numéricos adecuados" })
    .min(1, "El IVA debe ser mayor a 0")
    .max(100, "El IVA no puede ser mayor a 100"),
  providerId: z
    .number({
      required_error: "Selecciona un proveedor",
      invalid_type_error: "Selecciona un proveedor",
    })
    .min(1, "Selecciona un proveedor"),  
  tags: z.string().min(1, "Selecciona al menos una etiqueta"),
  category: z.string().min(1, "Selecciona una categoría"),
  imageFile: z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Solo se permiten imágenes en formato JPG, PNG o WEBP",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "La imagen no debe superar 1MB",
    })
    .optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductRegisterFormProps {
  token?: string;
}

export default function ProductRegisterForm({
  token,
}: ProductRegisterFormProps) {
  const p = useTranslations("ProductForm");
  const e = useTranslations("Error");
  const b = useTranslations("Button");
  const s = useTranslations("Success");
  const ph = useTranslations("Placeholder");

  const { providers } = useInitialData(token || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      description: "",
      cost: undefined,
      price: undefined,
      iva: undefined,
      providerId: undefined,
      tags: "",
      category: "PRODUCT",
      imageFile: undefined,
    },
  });

  const handleTagsChange = (selectedTags: string[]) => {
    setTags(selectedTags);
    setValue("tags", selectedTags.length > 0 ? selectedTags.join(",") : "");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewImage(null);
    const file = event.target.files?.[0];
    if (!file) {
      setValue("imageFile", undefined);
      return;
    }
    setValue("imageFile", file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!token) {
      toast("error", e("authError"));
      return;
    }

    const formData = new FormData();
    if (data.description) {
      formData.append("description", data.description);
    }

    formData.append("providerId", data.providerId.toString());

    Object.entries({
      name: data.productName,
      cost: data.cost,
      tags: data.tags,
      category: data.category,
      iva: data.iva,
      price: data.price,
    }).forEach(([key, value]) => formData.append(key, value.toString()));

    if (data.imageFile) formData.append("productImg", data.imageFile);
    setIsSubmitting(true);

    try {
      await registerProduct(formData, token);
      toast("success", s("successRegister", {field: "Producto"}), {
        duration: 2000,
        onAutoClose: () => router.back(),
        onDismiss: () => router.back(),
      });
    } catch (error : unknown) {
      toast("error", error instanceof Error ? error.message : e("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{p("title")}</h1>
      <div className="md:w-2/3 w-80">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div>
            <Label>{p("name")}</Label>
            <Input
              {...register("productName")}
              placeholder={ph("name")}
            />
            {errors.productName && (
              <p className="text-red-500">{errors.productName.message}</p>
            )}
          </div>
          <div>
            <Label>{p("description")}</Label>
            <textarea
              {...register("description")}
              placeholder={ph("description")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Costo */}
          <div>
            <Label>{p("cost")}</Label>
            <NumericInput
              id="cost"
              type="formattedNumber"
              placeholder={ph("cost")}
              value={watch("cost") ?? ""}
              onChange={(e) =>
                setValue("cost", Number(e.target.value), {
                  shouldValidate: true,
                })
              }
              className={errors.cost ? "border-red-500" : ""}
              error={errors.cost?.message}
            />
          </div>

          {/* Precio */}
          <div>
            <Label>{p("price")}</Label>
            <NumericInput
              id="price"
              type="formattedNumber"
              placeholder={ph("price")}
              value={watch("price") ?? ""}
              onChange={(e) =>
                setValue("price", Number(e.target.value), {
                  shouldValidate: true,
                })
              }
              className={errors.price ? "border-red-500" : ""}
              error={errors.price?.message}
            />
          </div>

          {/* IVA */}
          <div>
            <Label>{p("iva")}</Label>
            <NumericInput
              id="iva"
              type="formattedNumber"
              placeholder={ph("iva")}
              value={watch("iva") ?? ""}
              onChange={(e) =>
                setValue("iva", Number(e.target.value), {
                  shouldValidate: true,
                })
              }
              className={errors.iva ? "border-red-500" : ""}
              error={errors.iva?.message}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Proveedor */}
            <div className="w-full md:w-1/2">
            <Label>{p("provider")}</Label>
              <Controller
                name="providerId"
                control={control}
                render={({ field }) => (
                  <Select
                  onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    value={field.value?.toString() ?? ""}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        errors.providerId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder={b("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.businessName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.providerId && (
                <p className="text-red-500 text-sm">
                  {errors.providerId.message}
                </p>
              )}
            </div>

            {/* Etiquetas */}
            <div className="w-full md:w-1/2">
             <Label>{p("tags")}</Label>
              <TagFilter
                token={token || ""}
                selectedTags={tags}
                onChange={handleTagsChange}
              />
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tags.message}
                </p>
              )}
              {tags.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-blue-50 border border-blue-100 text-black text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors hover:bg-blue-100"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleTagsChange(tags.filter((t) => t !== tag))
                          }
                          className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-gray text-black hover:bg-blue-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Imagen */}
          <div className="w-full flex flex-col items-start relative">
            <Label className="pb-2">{p("image")}</Label>
            <Label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium text-center cursor-pointer">
              <Input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              {previewImage ? b("change") : b("upload")}
            </Label>
            {previewImage && (
              <div className="w-1/2 mt-4">
                <Image
                  src={previewImage}
                  className="w-full h-auto rounded-md"
                  alt="Vista previa del producto"
                  width={200}
                  height={200}
                  priority
                />
              </div>
            )}
            {errors.imageFile && (
              <p className="text-red-500 text-sm mt-2">
                {errors.imageFile.message}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-start gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              {b("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? b("saving") : b("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
