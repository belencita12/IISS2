"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/api/useFetch";
import { toast } from "@/lib/toast";
import { AUTH_API, CLIENT_API } from "@/lib/urls";
import { IUserProfile, FormClient } from "@/lib/client/IUserProfile";
import { phoneNumber, ruc } from "@/lib/schemas";

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
});

// Tipo inferido del schema
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
      
      // Actualizar valores del formulario
      setValue("fullName", data.fullName);
      setValue("email", data.email);
      setValue("adress", data.adress || "");
      setValue("phoneNumber", data.phoneNumber || "");
      setValue("ruc", data.ruc || "");
    }
  }, [data, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileFile(null);
      setPreviewImage(null);
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
      });
    }
    setProfileFile(null);
    setPreviewImage(null);
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
    register,
    errors,
    isDirty,
    handleSubmit: handleSubmit(onSubmit),
    handleFileChange,
    handleEdit,
    handleCancel,
  };
}