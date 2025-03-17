
export interface Image {
    id: number;
    previewUrl: string;
    originalUrl: string;
}

export interface EmployeeData {
    id?: number;
    fullName: string;
    email: string;
    position: WorkPosition;
    profileImg?: Image | null;
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