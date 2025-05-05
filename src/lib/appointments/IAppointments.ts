export interface Appointment {
    id: number;
    service: string;
    designatedDate: string;
    details: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"; // ajustar según el backend
    pet: {
      id: number;
      name: string;
      race: string;
      owner: {
        id: number;
        name: string;
      };
    };
    employees: {
      id: number;
      name: string;
    }[];
  }
  
  export interface AppointmentResponse {
    data: Appointment[];
    total: number;
    size: number;
    prev: boolean;
    next: boolean;
    currentPage: number;
    totalPages: number;
  }