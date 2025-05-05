
import { BaseQueryParams } from "../types";

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
    status?: 'PENDING' | 'COMPLETED' | 'CANCELED' ;
}
