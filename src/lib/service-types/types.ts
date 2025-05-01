export interface ServiceTypeFormData {
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