import { APPOINTMENT_API } from "../urls";
import { AppointmentData } from "./IAppointment";

export const getAllAppointments = async (
    token: string
  ): Promise<AppointmentData> => {
    const response = await fetch(`${APPOINTMENT_API}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener las citas");
    }
  
    const data = await response.json();
    return data as AppointmentData;
  };