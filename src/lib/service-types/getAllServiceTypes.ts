import { SERVICE_TYPE } from "../urls";
import { ServiceTypeResponse } from "./IServiceType";

export const getAllServiceTypes = async (
    token: string
  ): Promise<ServiceTypeResponse> => {
    const response = await fetch(`${SERVICE_TYPE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener los tipos de servicios");
    }
  
    const data = await response.json();
    return data as ServiceTypeResponse;
  };