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

export interface AppointmentQueryParams extends BaseQueryParams {
    clientRuc?: string;
    employeeRuc?: string;
    petId?: number;
    serviceId?: number;
    fromDesignatedDate?: string;
    toDesignatedDate?: string;
    status?: AppointmentStatus;
}


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

export interface AppointmentRegister {
    designatedDate: string;
    designatedTime: string;
    details?: string;
    serviceId: number; 
    petId: number;
    employeesId: number[];
  }

  export interface ServiceType{
    id?: number,
    slug: string,
    name: string,
    description: string,
    durationMin: number,
    maxColabs?: number,
    isPublic?: boolean,
    iva: number,
    price: number,
    cost: number,
    tags?: string[],
    img?: {
      id: number,
      previewUrl: string,
      originalUrl: string
    }
  }

  export interface AvailabilitySlot {
    time: string;
    isOcuppy: boolean;
  }
