import { APPOINTMENT } from "../urls";
import { AppointmentResponse } from "./IAppointments";

export const getAllAppointments = async (
    token: string
  ): Promise<AppointmentResponse> => {
    const response = await fetch(`${APPOINTMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener las citas");
    }
  
    const data = await response.json();
    return data as AppointmentResponse;
  };