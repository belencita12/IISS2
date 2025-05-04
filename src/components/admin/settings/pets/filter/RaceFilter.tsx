"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetRaces } from "@/hooks/races/useGetRaces";

interface RaceFilterProps {
  token: string;
  onSelectRace: (raceId: number | null) => void;
  selectedRaceId?: number | null;
  selectedSpeciesId?: number | null;
}

export function RaceFilter({
  token,
  onSelectRace,
  selectedRaceId,
  selectedSpeciesId,
}: RaceFilterProps) {
  const { data, isLoading, setQuery } = useGetRaces({
    init: {
      page: 1,
      size: 100,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
    },
    token,
    condition: true,
  });

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
    }));
  }, [selectedSpeciesId, setQuery]);

  const races = data?.data || [];

  const handleChange = (value: string) => {
    onSelectRace(value === "ALL" ? null : Number(value));
  };

  return (
    <div className="w-full text-sm space-y-1">
      <Label>Raza</Label>
      <Select
        value={
          selectedRaceId !== null && selectedRaceId !== undefined
            ? selectedRaceId.toString()
            : "ALL"
        }
        onValueChange={handleChange}
        disabled={isLoading || !selectedSpeciesId}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              selectedSpeciesId ? "Todas" : "Seleccione una especie primero"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">
            {selectedSpeciesId ? "Todas" : "Seleccione una especie primero"}
          </SelectItem>
          {races.map((race) => (
            <SelectItem key={race.id} value={race.id.toString()}>
              {race.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
