import { Appointment } from "./IAppointment";
import { APPOINTMENT_API } from "../urls";

export async function getAppointmentByPetId(
  petId: number,
  token: string,
  page: number = 1,
  size: number = 100
): Promise<Appointment[]> {
  const url = `${APPOINTMENT_API}?petId=${encodeURIComponent(petId)}&page=${page}&size=${size}`;
  const res = await fetch(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Error al obtener las citas de la mascota");
  }
  const data = await res.json();
  return data.data ?? [];
}