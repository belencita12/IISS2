import { PaginationResponse } from "../types";

export type Manufacturer = {
  name: string;
};

export type Vaccine = {
  id: number;
  speciesId: number;
  name: string;
  productId: number;
  manufacturer: Manufacturer;
};

export type VaccineRecord = {
  id: number;
  vaccineId: number;
  petId: number;
  dose: number;
  applicationDate: string | null;
  expectedDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  vaccine: {
    id: number;
    speciesId: number;
    name: string;
    productId: number;
    manufacturer: {
      name: string;
    };
  };
  pet: {
    name: string;
    client: {
      user: {
        fullName: string;
      };
    };
  };
};


export type VaccineRegistryDataResponse = PaginationResponse<VaccineRecord>;
