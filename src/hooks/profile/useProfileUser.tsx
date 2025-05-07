"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/api/useFetch";
import { toast } from "@/lib/toast";
import { AUTH_API, CLIENT_API } from "@/lib/urls";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { phoneNumber, ruc } from "@/lib/schemas";

const MAX_FILE_SIZE = 1024 * 1024; 
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Schema de validación para el formulario de perfil
const profileFormSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es obligatorio"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("El formato del correo electrónico no es válido"),
  adress: z.string().optional(),
  phoneNumber: phoneNumber(), // Reutilizando la validación del teléfono
  ruc: ruc().optional(), // Reutilizando la validación del RUC, pero opcional
  profileImg: z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "La imagen no debe superar 1MB",
    })
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function useProfileUser(
  clientId: number,
  token: string,
  updateUserData?: (data: { fullName?: string; avatarSrc?: string; ruc?: string | null }) => void
) {
  const [userData, setUserData] = useState<IUserProfile | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Configuración del formulario con React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      adress: "",
      phoneNumber: "",
      ruc: "",
      profileImg: undefined,
    },
  });

  const { data, loading, error, execute: fetchUser } = useFetch<IUserProfile>(
    `${AUTH_API}/me`,
    token,
    { immediate: true }
  );

  const { loading: updateLoading, execute: updateUser } = useFetch<IUserProfile>(
    `${CLIENT_API}/${clientId}`,
    token,
    { method: "PATCH" }
  );

  // Actualizar el formulario cuando se carguen los datos del usuario
  useEffect(() => {
    if (data) {
      setUserData(data);
      
      setValue("fullName", data.fullName);
      setValue("email", data.email);
      setValue("adress", data.adress || "");
      setValue("phoneNumber", data.phoneNumber || "");
      setValue("ruc", data.ruc || "");
    }
  }, [data, setValue]);

  const validateImage = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF";
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return "La imagen no debe superar 1MB";
    }
    
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar la imagen
      const validationError = validateImage(file);
      
      if (validationError) {
        setImageError(validationError);
        e.target.value = '';
        return;
      }
      
      setProfileFile(file);
      setValue("profileImg", file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileFile(null);
      setPreviewImage(null);
      setValue("profileImg", undefined);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    // Restaurar valores originales
    if (userData) {
      reset({
        fullName: userData.fullName,
        email: userData.email,
        adress: userData.adress || "",
        phoneNumber: userData.phoneNumber || "",
        ruc: userData.ruc || "",
        profileImg: undefined,
      });
    }
    setProfileFile(null);
    setPreviewImage(null);
    setImageError(null);
    setIsEditing(false);
  };

  const onSubmit = async (formData: ProfileFormValues) => {
    if (!userData) return;

    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("adress", formData.adress || "");
    form.append("phoneNumber", formData.phoneNumber || "");
    form.append("ruc", formData.ruc || "");
    
    if (profileFile) {
      form.append("profileImg", profileFile);
    }

    const response = await updateUser(form);
    
    if (response.ok && response.data) {
      setUserData(response.data);
      
      // Actualizar datos en el componente padre
      if (updateUserData) {
        updateUserData({
          fullName: response.data.fullName,
          avatarSrc: response.data.image?.originalUrl || "/blank-profile-picture-973460_1280.png",
          ruc: response.data.ruc || null
        });
      }
      
      toast("success", "Datos actualizados correctamente");
      setIsEditing(false);
    } else {
      toast("error", "Error al actualizar los datos");
    }
  };

  return {
    userData,
    isEditing,
    loading,
    error,
    updateLoading,
    profileFile,
    previewImage,
    imageError,
    register,
    errors,
    isDirty,
    handleSubmit: handleSubmit(onSubmit),
    handleFileChange,
    handleEdit,
    handleCancel,
  };
}