"use client";

import { useRouter } from 'next/navigation';
import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { useServiceTypeUpdate } from '@/hooks/service-types/useServiceTypeUpdate';
import { useServiceType } from '@/hooks/service-types/useServiceType';
import { toast } from 'sonner';

interface ServiceTypeEditPageProps {
  params: {
    id: string;
  };
  searchParams: {
    token: string;
  };
}

export default function ServiceTypeEditPage({ params, searchParams }: ServiceTypeEditPageProps) {
  const router = useRouter();
  const { id } = params;
  const { token } = searchParams;
  const { serviceType, isLoading: isLoadingServiceType } = useServiceType(id);
  const { updateServiceType, isLoading: isLoadingUpdate } = useServiceTypeUpdate(token);

  const handleSubmit = async (data: any) => {
    try {
      await updateServiceType(id, data);
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