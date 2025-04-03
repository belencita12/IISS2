
export interface Image {
    id: number;
    previewUrl: string;
    originalUrl: string;
}

export interface EmployeeData {
    id?: number;
    fullName: string;
    email: string;
    ruc: string;
    position: WorkPosition;
    adress?: string;
    phoneNumber: string;
    image?: Image | null;
}

export interface WorkPosition {
    id: number;
    name: string;
    shifts: Shift[];
}

export interface Shift {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
}