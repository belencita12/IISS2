"use client";

import { notFound } from 'next/navigation';
import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { useSession } from 'next-auth/react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { ServiceTypeFormData } from '@/lib/service-types/types';
import { createServiceType } from '@/lib/service-types/service';

export default function ServiceTypeRegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user?.token) {
    notFound();
  }

  const handleSubmit = async (data: ServiceTypeFormData) => {
    try {
      const formData = new FormData();
      
      // Campos obligatorios (*)
      formData.append("slug", data.slug);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("durationMin", data.durationMin.toString());
      formData.append("iva", data.iva.toString());
      formData.append("price", data.price.toString());
      formData.append("cost", data.cost.toString());
      
      // Campos opcionales
      if (data.maxColabs) formData.append("maxColabs", data.maxColabs.toString());
      if (data.isPublic !== undefined) formData.append("isPublic", data.isPublic.toString());
      
      // Enviar tags como array
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", data.tags.join(","));
      }
      
      if (data.img) formData.append("img", data.img);

      await createServiceType(session.user.token, formData);
      toast("success", "Tipo de servicio creado con éxito", {
        duration: 2000,
        onAutoClose: () => router.push("/dashboard/settings/service-types"),
        onDismiss: () => router.push("/dashboard/settings/service-types"),
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("ya están en uso")) {
        toast("error", "El nombre o slug del servicio ya está en uso. Por favor, elige otros valores.");
      } else {
        toast("error", "Error al registrar el tipo de servicio");
      }
    }
  };

  return (
    <>
      <ServiceTypeForm 
        token={session.user.token} 
        onSubmit={handleSubmit}
      />
    </>
  );
} 
