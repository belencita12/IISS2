"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { updateProduct } from "@/lib/products/updateProduct";
import { getProductById } from "@/lib/products/getProductById";
import { Product } from "@/lib/products/IProducts";
import { TagFilter } from "./filter/TagFilter";
import NumericInput from "@/components/global/NumericInput";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useInitialData } from "@/hooks/purchases/useProviderStock";

import { X } from "lucide-react";

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
    .min(1, "El IVA debe ser mayor a 0"),
  providerId: z
    .number({ invalid_type_error: "Selecciona un proveedor" })
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

interface ProductUpdateFormProps {
  userId?: number;
  token?: string;
}

export default function ProductUpdateForm({ token }: ProductUpdateFormProps) {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const { providers } = useInitialData(token || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
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
      cost: 0,
      price: 0,
      iva: 0,
      providerId: undefined,
      tags: "",
      category: "PRODUCT",
      imageFile: undefined,
    },
  });

  //Obtiene el producto
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    if (!id || !token) return;
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id, token);

        setProduct(productData);
        setValue("productName", productData.name);
        setValue("description", productData.description ?? "");
        setValue("cost", productData.cost ?? 0);
        setValue("price", productData.price ?? 0);
        setValue("iva", Number(productData.iva) ?? 0);

        setValue("category", productData.category);
        if (productData.provider?.id) {
          setValue("providerId", productData.provider.id);
        }

        // Configurar las etiquetas
        if (productData.tags && productData.tags.length > 0) {
          setTags(productData.tags);
          setValue("tags", productData.tags.join(","));
        }

        if (productData.image?.originalUrl) {
          setPreviewImage(productData.image.originalUrl);
        }
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        setError("No se pudo cargar el producto");
        toast("error", "Error al obtener el producto");
      }
    };
    fetchProduct();
  }, [id, token, setValue]);

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
      toast("error", "Debes estar autenticado para actualizar el producto");
      return;
    }
    if (!id) {
      toast("error", "Producto no encontrado");
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
      await updateProduct(id, formData, token);
      toast("success", "Producto actualizado con éxito", {
        duration: 2000,
        onAutoClose: () => {
          router.push(`/dashboard/products/${id}`);
        },
        onDismiss: () => router.push(`/dashboard/products/${id}`),
      });
    } catch {
      toast("error", "Hubo un error al actualizar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-8">
      {isLoading ? (
        <div className="text-center mt-8">Cargando...</div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">{error}</div>
      ) : !product ? (
        <div className="text-center mt-8">No se encontró el producto.</div>
      ) : (
        <div className="md:w-2/3 w-80">
          <h1 className="text-3xl font-bold mb-6">Actualizar Producto</h1>
          <form
            id="productForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <Label>Nombre</Label>
              <Input
                {...register("productName")}
                placeholder="Ingrese el nombre del producto"
              />
              {errors.productName && (
                <p className="text-red-500">{errors.productName.message}</p>
              )}
            </div>
            <div>
              <Label>Descripción</Label>
              <textarea
                {...register("description")}
                placeholder="Ingrese una descripción del producto"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-sm placeholder:text-gray-500"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div>
              <Label>Costo</Label>
              <NumericInput
                id="cost"
                type="formattedNumber"
                placeholder="Ingrese el costo"
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
            <div>
              <Label>Precio</Label>
              <NumericInput
                id="price"
                type="formattedNumber"
                placeholder="Ingrese el precio"
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
            <div>
              <Label>IVA</Label>
              <NumericInput
                id="iva"
                type="formattedNumber"
                placeholder="Ingrese el IVA"
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
                <Label>Proveedor</Label>
                <Controller
                  name="providerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString() ?? ""}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          errors.providerId ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.businessName}
                          </SelectItem>
                        ))}
                        {providers.length === 0 && (
                          <SelectItem disabled value="none">
                            No hay proveedores disponibles
                          </SelectItem>
                        )}
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
                <Label>Etiqueta/s</Label>
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
                          className="bg-blue-50 border border-blue-100 text-black text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 hover:bg-blue-100"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleTagsChange(tags.filter((t) => t !== tag))
                            }
                            className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-gray text-black hover:bg-blue-300"
                            aria-label={`Eliminar etiqueta ${tag}`}
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
            <div className="w-full flex flex-col items-start relative">
              <Label className="pb-2">Imagen</Label>
              <Label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium text-center cursor-pointer">
                <Input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewImage ? "Cambiar imagen" : "Subir imagen del producto"}
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
            <div className="flex justify-start gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/products/${id}`);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
