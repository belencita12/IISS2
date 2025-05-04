export interface AppointmentEmployee {
    id: number;
    name: string;
  }
  
  export interface AppointmentPetOwner {
    id: number;
    name: string;
  }
  
  export interface AppointmentPet {
    id: number;
    name: string;
    race: string;
    owner: AppointmentPetOwner;
  }
  
  export type AppointmentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  
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