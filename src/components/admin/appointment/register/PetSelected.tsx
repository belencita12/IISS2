import { PetData } from "@/lib/pets/IPet";
import { useTranslations } from "next-intl";

type PetSelectedProps = {
  pet: PetData;
};

export default function PetSelected({ pet }: PetSelectedProps) {
  const a = useTranslations("AppointmentForm");
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p><strong>{a("petSelected")}:</strong> {pet.name}</p>
      <p><strong>{a("owner")}:</strong> {pet.owner.name}</p>
    </div>
  );
}
