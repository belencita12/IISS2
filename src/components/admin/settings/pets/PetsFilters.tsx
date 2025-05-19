"use client";

import React from "react";
import SearchBar from "@/components/global/SearchBar";
import { SpeciesFilter } from "./filter/SpeciesFilter";
import { RaceFilter } from "./filter/RaceFilter";
import PetDateFilter from "./filter/PetDateFilter";

interface PetFiltersProps {
  token: string;
  onPetSearch: (query: string) => void;
  onClientSearch: (query: string) => void;
  onSpeciesFilter: (speciesId: number | null) => void;
  onRaceFilter: (raceId: number | null) => void;
  to: string | undefined;
  from: string | undefined;
  setDateTo: (to: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
  petSearchQuery?: string;
  clientSearchQuery?: string;
  selectedSpeciesId?: number | null;
  selectedRaceId?: number | null;
}

export function PetFilters({
  token,
  onPetSearch,
  onClientSearch,
  onSpeciesFilter,
  onRaceFilter,
  setDateFrom,
  setDateTo,
  to,
  from,
  petSearchQuery = "",
  clientSearchQuery = "",
  selectedSpeciesId = null,
  selectedRaceId = null,
}: PetFiltersProps) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mt-4">
        <div className="w-full md:w-1/2">
          <SearchBar
            onSearch={onPetSearch}
            placeholder="Buscar por nombre de la mascota..."
            debounceDelay={500}
            defaultQuery={petSearchQuery}
          />
        </div>

        <div className="w-full md:w-1/2">
          <SearchBar
            onSearch={onClientSearch}
            placeholder="Buscar por nombre del cliente..."
            debounceDelay={500}
            defaultQuery={clientSearchQuery}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <div className="w-full md:w-1/2">
          <SpeciesFilter
            token={token}
            onSelectSpecies={onSpeciesFilter}
            selectedSpeciesId={selectedSpeciesId}
          />
        </div>
        <div className="w-full md:w-1/2">
          <RaceFilter
            token={token}
            onSelectRace={onRaceFilter}
            selectedRaceId={selectedRaceId}
            selectedSpeciesId={selectedSpeciesId}
          />
        </div>
      </div>
      <div className="mt-2">
        <PetDateFilter
          to={to}
          from={from}
          setDateTo={setDateTo}
          setDateFrom={setDateFrom}
        />
      </div>
    </div>
  );
}
