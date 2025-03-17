import { PaginationResponse } from "../types";

export interface Image {
    id: number;
    previewUrl: string;
    originalUrl: string;
}

export interface PetData {
    id?: number;
    name: string;
    userId: number;
    species: Species;
    race: Race;
    weight: number;
    sex: string;
    profileImg?: Image | null;
    dateOfBirth: string;
}

export interface Race {
    id: number;
    name: string;
    speciesId: number;
}

export interface Species {
    id: number;
    name: string;
}

export type PetDataResponse = PaginationResponse<PetData>