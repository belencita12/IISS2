import { PaginationResponse } from "../types";

export type VaccineRecord = {
    id: number;
    name: string;
    vaccineId: number;
    petId: number;
    dose: number;
    applicationDate: string;
    expectedDate: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: Record<string, unknown> | null;
  };

export type VaccineRegistryDataResponse = PaginationResponse<VaccineRecord>;