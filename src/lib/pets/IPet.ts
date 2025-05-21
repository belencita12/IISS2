import { BaseQueryParams, PaginationResponse } from "../types";

export interface Image {
  id: number;
  previewUrl: string;
  originalUrl: string;
}

export interface PetData {
  id?: number;
  name: string;
  owner: {
    id: number;
    name: string;
  };
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
  species: {
    name: string;
  };
}

export interface Species {
  id: number;
  name: string;
  deletedAt?: string | null;
}

export interface SpeciesQueryParams extends BaseQueryParams {
  name?: string;
}

export interface RacesQueryParams extends BaseQueryParams {
  name?: string;
  speciesId?: number;
}

export type PetDataResponse = PaginationResponse<PetData>;

export interface ListPetData {
  id: number;
  name: string;
  owner: {
    id: number;
    name: string;
  };
  species: Species;
  race: Race;
  profileImg?: Image | null;
}
