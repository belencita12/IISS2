export interface Manufacturer {
  id: number;
  name: string;
}

export interface Species {
  id: number;
  name: string;
}

export interface VaccineImage {
  originalUrl: string;
}

export interface ProductData {
  cost: unknown;  // Puede ser objeto decimal o número
  iva: unknown;
  price: unknown;
}

export interface Vaccine {
  id: number;
  name: string;
  species: {
    id: number;
    name: string;
  };
  manufacturer: {
    id: number;
    name: string;
  };
  product: {
    id: number;
    name: string;
    code: string;
    cost: number;
    iva: number;
    category: string;
    price: number;
    quantity: number;
    tags: string[];
    image?: {
      id: number;
      previewUrl: string;
      originalUrl: string;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt: unknown; 
  };
}

// src/lib/vaccine/types.ts
// src/lib/vaccine/IVaccine.ts

export interface VaccineFormValues {
  id: number;
  name: string;
  manufacturer: Manufacturer;
  species: Species;
  cost: number;
  iva: number;
  price: number;
  productImgUrl?: string;
  description: string;
  providerId: number;
  provider?: {
    id: number;
    businessName: string;
  };
}



export interface IVaccine {
  id: number;
  name: string;
  manufacturer: { id: number; name: string };
  species: { id: number; name: string };
}


export interface VaccineListProps {
  token: string | null;
}
