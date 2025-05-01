import { useState, useEffect } from 'react';
import { getServiceTypeById } from '@/lib/service-types/service';
import { ServiceType } from '@/lib/service-types/types';

export const useServiceType = (id: string) => {
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceType = async () => {
      try {
        const response = await getServiceTypeById(id);
        setServiceType(response);
      } catch (err) {
        setError('Error al cargar el tipo de servicio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceType();
  }, [id]);

  return { serviceType, isLoading, error };
}; 