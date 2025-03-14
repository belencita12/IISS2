export type PaginationResponse<T> = {
    data: T[];
    total: number;
    size: number;
    prev: boolean;
    next: boolean;
    currentPage: number;
    totalPages: number;
};
