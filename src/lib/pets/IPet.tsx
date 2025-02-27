
export interface PetData {
    name: string;
    speciesId: number;
    raceId: number;
    weight: number;
    sex: string;
    profileImg: string | null;
    dateOfBirth: string;
    vaccinationBookletId: number
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