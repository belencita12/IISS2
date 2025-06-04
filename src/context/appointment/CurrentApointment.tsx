"use client";
import { createContext, useContext, useState } from "react";
import { AppointmentData } from "@/lib/appointment/IAppointment";

interface CurrentAppointmentContextType {
  currentAppointment: AppointmentData | null;
  setCurrentAppointment: (appointment: AppointmentData) => void;
}

const CurrentAppointmentContext = createContext<
  CurrentAppointmentContextType | undefined
>(undefined);

export const CurrentAppointmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentAppointment, setCurrentAppointment] =
    useState<AppointmentData | null>(null);

  return (
    <CurrentAppointmentContext.Provider
      value={{ currentAppointment, setCurrentAppointment }}
    >
      {children}
    </CurrentAppointmentContext.Provider>
  );
};

export const useCurrentAppointment = () => {
  const context = useContext(CurrentAppointmentContext);
  if (!context)
    throw new Error(
      "useCurrentAppointment must be used within a CurrentAppointmentProvider"
    );
  return context;
};
