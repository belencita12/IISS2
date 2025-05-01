"use client";

import { useRouter } from 'next/navigation';
import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { useServiceTypeUpdate } from '@/hooks/service-types/useServiceTypeUpdate';
import { useServiceType } from '@/hooks/service-types/useServiceType';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ServiceTypeFormData } from "@/lib/service-types/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    token: string;
  }>;
}

export default function ServiceTypeEditPage({ params, searchParams }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const { serviceType, isLoading: isLoadingServiceType } = useServiceType(id);
  const { updateServiceType, isLoading: isLoadingUpdate } = useServiceTypeUpdate(token);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
    });
    searchParams.then(({ token }) => {
      setToken(token);
    });
  }, [params, searchParams]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData: ServiceTypeFormData = {
        slug: data.slug as string,
        name: data.name as string,
        description: data.description as string,
        durationMin: data.durationMin as number,
        iva: data.iva as number,
        price: data.price as number,
        cost: data.cost as number,
        maxColabs: data.maxColabs as number | undefined,
        isPublic: data.isPublic as boolean | undefined,
        tags: data.tags as string[] | undefined,
        img: data.img as File | undefined
      };
      await updateServiceType(id, formData);
      toast.success('Tipo de servicio actualizado exitosamente');
      router.push('/dashboard/settings/service-types');
    } catch (error) {
      toast.error('Error al actualizar el tipo de servicio');
    }
  };

  if (isLoadingServiceType) {
    return <div>Cargando...</div>;
  }

  if (!serviceType) {
    return <div>Tipo de servicio no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Tipo de Servicio</h1>
        <p className="text-muted-foreground">
          Modifique los datos del tipo de servicio
        </p>
      </div>

      <ServiceTypeForm
        token={token}
        initialData={serviceType}
        onSubmit={handleSubmit}
        isSubmitting={isLoadingUpdate}
      />
    </div>
  );
} 