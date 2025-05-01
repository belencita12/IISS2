import { useState, useEffect } from 'react';
import { getServiceTypeById } from '@/lib/service-types/service';
import { ServiceTypeFormData } from '@/lib/service-types/types';

export const useServiceType = (id: string, token: string) => {
  const [serviceType, setServiceType] = useState<ServiceTypeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceType = async () => {
      try {
        const response = await getServiceTypeById(token, parseInt(id, 10));
        setServiceType(response);
      } catch (err) {
        setError('Error al cargar el tipo de servicio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceType();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { serviceType, isLoading, error };
}; 