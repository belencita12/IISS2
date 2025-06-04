import { PetData } from "@/lib/pets/IPet";
import { useTranslations } from "next-intl";

type PetSelectedProps = {
  pet: PetData;
};

export default function PetSelected({ pet }: PetSelectedProps) {
  const t = useTranslations();
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p>{t("appointmentForm.selectedPet.pet", {pet: pet.name})} </p>
      <p>{t("appointmentForm.selectedPet.owner", {owner: pet.owner.name})}</p>
    </div>
  );
}
