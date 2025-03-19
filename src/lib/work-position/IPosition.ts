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

export type PositionFormValues = {
    name: string;
    shifts: {
        weekDay: number | number[];
        startTime: string;
        endTime: string;
    }[];
};