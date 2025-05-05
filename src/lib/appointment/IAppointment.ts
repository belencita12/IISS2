import App from "next/app";
import { BaseQueryParams } from "../types";

export interface AppointmentEmployee {
    id: number;
    name: string;
  }

  export interface AppointmentPet {
    id: number;
    name: string;
    race: string;
    owner: AppointmentPetOwner;
  }
  
  export interface Appointment {
    id: number;
    designatedDate: string;
    completedDate?: string | null;
    details: string;
    service: string;
    pet: AppointmentPet;
    status: AppointmentStatus;
    employees: AppointmentEmployee[];
  }

export interface AppointmentPetOwner {
  id: number;
  name: string;
}
  
  
export type AppointmentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface AppointmentData {
    id: number;
    designatedDate: string;
    completedDate: string;
    details: string;
    service: string; 
    pet: {
      id: number;
      name: string;
      race: string;
      owner: {
        id: number;
        name: string;
      };
    };
    status: AppointmentStatus;
    employees: {
      id: number;
      name: string;
    }[];
  }

export interface AppointmentQueryParams extends BaseQueryParams {
    clientRuc?: string;
    employeeRuc?: string;
    petId?: number;
    serviceId?: number;
    fromDesignatedDate?: string;
    toDesignatedDate?: string;
    status?: AppointmentStatus;
}