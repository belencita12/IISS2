export interface ServiceType {
    id: number;
    name: string;
    slug: string;
    description: string;
    durationMin: number;
    price: number;
    tags: string[];
    img?: {
        id: number;
        originalUrl: string;
        previewUrl: string;
    };
}

export interface ServiceTypeResponse {
    data: ServiceType[];
    total: number;
    size: number;
    prev: boolean;
    next: boolean;
    currentPage: number;
    totalPages: number;
}
