import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import { VaccineRecord } from "@/lib/vaccine-registry/IVaccineRegistry";
import { PetData } from "@/lib/pets/IPet";
import { IUserProfile } from "@/lib/client/IUserProfile";
import { getVaccineRegistryById } from "@/lib/vaccine-registry/getVaccineRegistryById";
import { getPetById } from "@/lib/pets/getPetById";
import { getClientById } from "@/lib/client/getClientById";

export const useVaccineRegistryDetail = (id: number, token: string) => {
  const [registry, setRegistry] = useState<VaccineRecord | null>(null);
  const [pet, setPet] = useState<PetData | null>(null);
  const [owner, setOwner] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const registryData = await getVaccineRegistryById(token, id);
        if (!registryData) {
          setError(true);
          return;
        }

        setRegistry(registryData);

        const petData = await getPetById(registryData.petId, token);
        setPet(petData);

        if (petData?.owner?.id) {
          const ownerData = await getClientById(petData.owner.id, token);
          setOwner(ownerData);
        }
      } catch (err) {
        toast("error", "Error al obtener datos del registro, mascota o cliente");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, token]);

  return { registry, pet, owner, loading, error };
};
