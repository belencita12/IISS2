import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { useTranslations } from "next-intl";

type PetSexSelectorProps = {
  selected?: string;
  onChange: (sex: string) => void;
  error?: string;
};

const PetSexSelector = ({ selected, error, onChange }: PetSexSelectorProps) => {
const p = useTranslations("PetForm");

  return (
    <div className="flex flex-col gap-1">
      <Label>{p("sex")}</Label>
      <div className="flex gap-4">
        <Button
          id="sexFemale"
          type="button"
          variant={selected === "F" ? "default" : "outline"}
          onClick={() => onChange("F")}
        >
          {p("female")}
        </Button>
        <Button
          id="sexMale"
          type="button"
          variant={selected === "M" ? "default" : "outline"}
          onClick={() => onChange("M")}
        >
          {p("male")}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default PetSexSelector;
