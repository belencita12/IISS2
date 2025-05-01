import { useState } from 'react';

export interface useServiceTypeFormData {
  name: string;
  slug: string;
  description: string;
  durationMin: number;
  _iva: number;
  _price: number;
  maxColabs?: number;
  isPublic?: boolean;
  tags?: string[];
  img?: File;
}

export const useServiceTypeFormData = (initialData: useServiceTypeFormData) => {
  const [formData, setFormData] = useState<useServiceTypeFormData>(initialData);

  const handleChange = <K extends keyof useServiceTypeFormData>(field: K, value: useServiceTypeFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  return {
    formData,
    handleChange,
    resetForm,
  };
};
