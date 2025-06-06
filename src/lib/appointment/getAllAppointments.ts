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
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }

  
    const data = await response.json();
    return data as AppointmentData;
  };