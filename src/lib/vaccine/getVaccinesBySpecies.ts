import { VACCINE_API } from "@/lib/urls";
import { toast } from "@/lib/toast";

interface VaccineSearchParams {
  name?: string;
  manufacturerId?: number;
}

export async function getVaccinesBySpecies(
  token: string,
  speciesId: number,
  page: number = 1,
  searchParams: VaccineSearchParams = {}
) {
  try {
    const url = new URL(VACCINE_API);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("speciesId", speciesId.toString());

    if (searchParams.name) {
      url.searchParams.append("name", searchParams.name);
    }

    if (searchParams.manufacturerId) {
      url.searchParams.append(
        "manufacturerId",
        searchParams.manufacturerId.toString()
      );
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast("error", "Error al obtener vacunas por especie.");
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    toast("error", "Error al obtener vacunas por especie.");
    return [];
  }
}
