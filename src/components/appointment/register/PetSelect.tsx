"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PetData } from "@/lib/pets/IPet";
import { PET_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api";
import { useTranslations } from "next-intl";

type ClientPetSelectProps = {
  clientId: number;
  token: string;
  onSelectPet: (pet: PetData) => void;
};

type PetResponse = {
  data: PetData[];
};

export default function ClientPetSelect({
  clientId,
  token,
  onSelectPet,
}: ClientPetSelectProps) {
  const [pets, setPets] = useState<PetData[]>([]);
  const [selectedPetName, setSelectedPetName] = useState<string>("");

  const { data, get } = useFetch<PetResponse>("", token);

  const ph = useTranslations("Placeholder");

  useEffect(() => {
    if (clientId) {
      get(undefined, `${PET_API}?clientId=${clientId}&page=1&size=100`);
    }
  }, [clientId]);

  useEffect(() => {
    if (data?.data) {
      setPets(data.data);
    }
  }, [data]);

  const handleSelect = (petId: string) => {
    const selectedPet = pets.find((p) => p.id === Number(petId));
    if (selectedPet) {
      setSelectedPetName(selectedPet.name);
      onSelectPet(selectedPet);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-full h-11 border-myPurple-tertiary focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200">
            {selectedPetName ? (
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-start flex items-center">
                {selectedPetName}
              </div>
            ) : (
              <SelectValue placeholder={ph("select")} />
            )}
          </SelectTrigger>
          <SelectContent className="border-myPurple-tertiary">
            {pets.map((pet) => (
              <SelectItem
                key={pet.id}
                value={String(pet.id)}
                className="focus:bg-myPurple-disabled/50"
              >
                <div className="flex flex-col py-1">
                  <p className="font-medium">{pet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pet.race.name}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}