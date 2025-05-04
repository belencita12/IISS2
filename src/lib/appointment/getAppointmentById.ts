import { APPOINTMENT_API } from "@/lib/urls";
import Appointment from "@/lib/appointment/IAppointment";
import { toast } from "@/lib/toast";

export async function getAppointmentById(id: string, token:string):
Promie<Appointment> {
    try{
        const res = await fetch(`${APPOINTMENT_API}/${id}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
          });

        if (!res.ok) {
            throw new Error(`Error fetching appointment: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        toast('error', 'Error fetching appointment', error.message);
        throw error;
    }
  }