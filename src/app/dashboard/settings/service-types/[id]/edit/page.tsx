'use client';

import { useRouter } from 'next/navigation';
import ServiceTypeForm from '@/components/admin/settings/service-types/ServiceTypeForm';
import { useServiceTypeUpdate } from '@/hooks/service-types/useServiceTypeUpdate';
import { useServiceType } from '@/hooks/service-types/useServiceType';
import { useEffect, useState } from 'react';

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
  const { serviceType, isLoading: isLoadingServiceType } = useServiceType(id, token);
  const { updateServiceType, isLoading: isLoadingUpdate } = useServiceTypeUpdate(token);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
    });
    searchParams.then(({ token }) => {
      setToken(token);
    });
  }, [params, searchParams]);

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
        _initialData={serviceType}
        _isSubmitting={isLoadingUpdate}
      />
    </div>
  );
} 