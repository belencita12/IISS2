import type { PetData } from "@/lib/pets/IPet";
import { useTranslations } from "next-intl";

type PetSelectedProps = {
  pet: PetData;
};

export default function PetSelected({ pet }: PetSelectedProps) {

  const a = useTranslations("AppointmentForm")
  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70 mt-1">
            {a("petSelected")}: {pet.name}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
            {a("race")}: {pet.race.name}
          </p>
        </div>
      </div>
    </div>
  );
}