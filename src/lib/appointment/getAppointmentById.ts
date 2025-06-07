import { APPOINTMENT_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import { AppointmentData } from "./IAppointment";

export async function getAppointmentById(id: string, token:string): Promise<AppointmentData> {
    try{
        const res = await fetch(`${APPOINTMENT_API}/${id}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
          });

        if (!res.ok) {
            throw new Error(`Error al obtener la cita: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ocurrio un error inesperado';
        toast('error', `${errorMessage}`);
        throw error;
    }
  }