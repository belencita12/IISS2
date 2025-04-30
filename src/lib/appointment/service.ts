import { AppointmentData } from "./IAppointment";
import { APPOINTMENT_API } from "../urls";
import { PaginationResponse } from "../types";

export const getAppointments = async (token: string, queryParamsStr?: string) => {
  const url = `${APPOINTMENT_API}?${queryParamsStr ?? ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data as PaginationResponse<AppointmentData>;
};




export const completeAppointment = async (id: number, token: string) => {
  const res = await fetch(`${APPOINTMENT_API}/complete/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData?.message || "Error al completar la cita";
    throw new Error(message);
  }


  return; 
};

export const cancelAppointment = async (id: number, token: string) => {
  const res = await fetch(`${APPOINTMENT_API}/cancel/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData?.message || "Error al cancelar la cita";
    throw new Error(message);
  }


  return await res.json();
};
