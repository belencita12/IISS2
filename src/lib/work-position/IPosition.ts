export interface Shift {
    weekDay: number | number [];
    startTime: string;
    endTime: string;
}

export interface Position {
    name: string;
    shifts: Shift[];
}

export interface ShiftResponse extends Shift {
    id: number;
}