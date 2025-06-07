export interface VaccineManufacturer {
    id: number;
    name: string;
  }
  
  export interface Vaccine {
    id: number;
    name: string;
    species: {
      name: string;
    };
    product: {
      price: number;
    };
  }
  