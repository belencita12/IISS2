"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  clientId: number;
  petId: number;
}

export default function AddToHistoryButton({ clientId, petId }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/clients/${clientId}/pet/${petId}/vaccine-registry/vaccine-new`);
  };

  return (
    <Button
      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
      onClick={handleClick}
    >
      Agregar al Historial
    </Button>
  );
}
