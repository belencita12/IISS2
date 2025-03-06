
export interface PetData {
    id?:number
    name: string;
    userId: number;
    speciesId: number;
    raceId: number;
    weight: number;
    sex: string;
    profileImg: string | null;
    dateOfBirth: string;
}
export interface Race {
    id: number;
    name: string;
    speciesId: number;
}

export interface Species {
    id: number;
    name: string;
}