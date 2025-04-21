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
  manufacturer: Manufacturer;
  species: Species;
  product?: ProductData;
  image?: VaccineImage;
  // Campos convertidos para facilidad de uso en frontend
  cost: number;
  iva: number;
  price: number;
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
