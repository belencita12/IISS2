export interface ServiceTypeFormData {
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  _iva: number;
  _price: number;
  cost: number;
  maxColabs?: number;
  isPublic?: boolean;
  tags?: string[];
  img?: File;
} 