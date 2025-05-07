import { Appointment } from "./IAppointment";
import { APPOINTMENT_API } from "../urls";

export async function getAppointmentByClient(
  clientRuc: string,
  token: string
): Promise<Appointment[]> {
  const url = `${APPOINTMENT_API}?clientRuc=${encodeURIComponent(clientRuc)}`;
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
    throw new Error("Error al obtener las citas del cliente");
  }
  return res.json();
}