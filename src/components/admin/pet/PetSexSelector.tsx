import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import React from "react";

type PetSexSelectorProps = {
  selected?: string;
  onChange: (sex: string) => void;
  error?: string;
};

const PetSexSelector = ({ selected, error, onChange }: PetSexSelectorProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Género</Label>
      <div className="flex gap-4">
        <Button
          id="sexFemale"
          type="button"
          variant={selected === "F" ? "default" : "outline"}
          onClick={() => onChange("F")}
        >
          Hembra
        </Button>
        <Button
          id="sexMale"
          type="button"
          variant={selected === "M" ? "default" : "outline"}
          onClick={() => onChange("M")}
        >
          Macho
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default PetSexSelector;
