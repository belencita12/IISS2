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

const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const productFormSchema = z.object({
  productName: z.string().min(1, "El nombre es obligatorio"),
  cost: z.number({ message: "Complete con valores numéricos adecuados" }).min(1, "El costo debe ser mayor a 0"),
  price: z.number({ message: "Complete con valores numéricos adecuados" }).min(1, "El precio debe ser mayor a 0"),
  iva: z.number({ message: "Complete con valores numéricos adecuados" }).min(1, "El IVA debe ser mayor a 0"),
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
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      cost: 0,
      price: 0,
      iva: 0,
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
        const productData = await getProductById(id as string, token);

        setProduct(productData);
        setValue("productName", productData.name);
        setValue("cost", productData.cost ?? 0);
        setValue("price", productData.price ?? 0);
        setValue("iva", Number(productData.iva) ?? 0);
        setValue("category", productData.category);
        
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
      await updateProduct(id as string, formData, token);
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
              <Label>Costo</Label>
              <Input
                type="number"
                placeholder="Ingrese el costo"
                step={0.1}
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                {...register("cost", { valueAsNumber: true })}
              />
              {errors.cost && (
                <p className="text-red-500">{errors.cost.message}</p>
              )}
            </div>
            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                step={0.1}
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                placeholder="Ingrese el precio"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label>IVA</Label>
              <Input
                type="number"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                placeholder="Ingrese el IVA"
                {...register("iva", { valueAsNumber: true })}
              />
              {errors.iva && (
                <p className="text-red-500">{errors.iva.message}</p>
              )}
            </div>
            <div>
              <Label>Etiquetas</Label>
              <TagFilter
                token={token || ''}
                selectedTags={tags}
                onChange={handleTagsChange}
              />
              {errors.tags && 
                <p className="text-red-500">{errors.tags.message}</p>
              }
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
                    width={96}
                    height={96}
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
