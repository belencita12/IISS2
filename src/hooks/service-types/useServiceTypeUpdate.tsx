import { useState } from 'react';
import { updateServiceType } from '@/lib/service-types/service';
import { ServiceType } from '@/lib/service-types/types';

interface ServiceTypeFormData {
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  iva: number;
  price: number;
  cost: number;
  maxColabs?: number;
  isPublic?: boolean;
  tags?: string[];
  img?: File;
}

export const useServiceTypeUpdate = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateServiceTypeHandler = async (id: string, data: ServiceTypeFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Campos obligatorios
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

      await updateServiceType(token, Number(id), formData);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateServiceType: updateServiceTypeHandler, isLoading };
}; 