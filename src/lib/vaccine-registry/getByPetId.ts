import { VACCINE_REGISTRY_API } from "../urls";
import { VaccineRegistryDataResponse } from "./IVaccineRegistry";

export const getByPetId = async (petId: number,token:string) => {
    try {
        const res = await fetch(`${VACCINE_REGISTRY_API}/${petId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (res.ok){
            const data = await res.json();
            return data as VaccineRegistryDataResponse;
        }
    } catch (error) {
        console.error("Error al obtener vacunas", error);
    }
}
