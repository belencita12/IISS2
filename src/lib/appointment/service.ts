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


