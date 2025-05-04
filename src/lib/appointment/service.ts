import { AppointmentData } from "./IAppointment";
import { APPOINTMENT_API } from "../urls";
import { PaginationResponse } from "../types";
import { AppointmentRegister } from "./IAppointment";
import { AvailabilitySlot } from "./IAppointment";

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

export const cancelAppointment = async (id: number, token: string, description: string) => {
  const res = await fetch(`${APPOINTMENT_API}/cancel/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData?.message || "Error al cancelar la cita";
    throw new Error(message);
  }


  return;
};

export const createAppointment = async (token: string, appointment: AppointmentRegister) => {
  const res = await fetch(APPOINTMENT_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData?.message || "Error al crear la cita";
    throw new Error(message);
  }

  return;
};

export const getAvailability = async (token: string, id: string, date: string) => {
  const res = await fetch(`${APPOINTMENT_API}/availability/${id}?date=${date}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData?.message || "Error al obtener la disponibilidad";
    throw new Error(message);
  }

  const data = await res.json();
  return data as AvailabilitySlot[];
};


