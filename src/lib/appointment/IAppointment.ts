import { BaseQueryParams } from "../types";

export interface AppointmentData {
    id?: number;
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
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
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
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' ;
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