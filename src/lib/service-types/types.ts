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
  
  export interface ServiceType {
    id: string;
    slug: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    cost: number;
    iva: number;
    maxColabs?: number;
    isPublic: boolean;
    imageUrl: string;
    tags: string[];
  } 
