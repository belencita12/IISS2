import { APPOINTMENT_API } from "@/lib/urls";
import {Appointment} from "@/lib/appointment/IAppointment";
import { toast } from "@/lib/toast";

export async function getAppointmentById(id: string, token:string): Promise<Appointment> {
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