import { VACCINE_REGISTRY_API } from "../urls";
import { VaccineRegistryDataResponse } from "./IVaccineRegistry";

export const getByPetId = async (petId: number,token:string,page:number) => {
    try {
        const res = await fetch(`${VACCINE_REGISTRY_API}?page=${page}&petId=${petId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data as VaccineRegistryDataResponse;
    } catch (error) {
        console.error("Error al obtener vacunas", error);
    }
}
