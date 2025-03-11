
export interface Image {
    id: number;
    previewUrl: string;
    originalUrl: string;
}

export interface PetData {
    id?: number;
    name: string;
    userId: number;
    speciesId: number;
    raceId: number;
    weight: number;
    sex: string;
    profileImg?: Image | null; // Ahora puede ser el objeto con las URLs o null
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