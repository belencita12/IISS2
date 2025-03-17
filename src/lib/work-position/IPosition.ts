export interface Shift {
    weekDay: number | number[];
    startTime: string;
    endTime: string;
    id?: number;
}

export interface Position {
    id?: number;
    name: string;
    shifts: Shift[];
}