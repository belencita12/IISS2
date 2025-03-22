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
  vaccine: Vaccine;
};

export type VaccineRegistryDataResponse = PaginationResponse<VaccineRecord>;
