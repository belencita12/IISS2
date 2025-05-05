"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetSpecies } from "@/hooks/species/useGetSpecies";

interface SpeciesFilterProps {
  token: string;
  onSelectSpecies: (speciesId: number | null) => void;
  selectedSpeciesId?: number | null;
}

export function SpeciesFilter({
  token,
  onSelectSpecies,
  selectedSpeciesId,
}: SpeciesFilterProps) {
  const { data, isLoading } = useGetSpecies({
    init: { page: 1, name: "" },
    token,
  });

  const handleChange = (value: string) => {
    onSelectSpecies(value === "ALL" ? null : Number(value));
  };

  const speciesList = data?.data || [];

  return (
    <div className="w-full text-sm space-y-1">
      <Label>Especie</Label>
      <Select
        value={
          selectedSpeciesId !== null && selectedSpeciesId !== undefined
            ? selectedSpeciesId.toString()
            : "ALL"
        }
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          {speciesList.map((s) => (
            <SelectItem key={s.id} value={s.id.toString()}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
