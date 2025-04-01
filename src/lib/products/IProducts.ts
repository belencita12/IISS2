export interface Product {
    id: string;
    code: string;
    name: string;
    category: string;
    price: number;
    iva?: number;
    stock: number;
    tags?: string[],
    originalUrl?: string;
    image?: {
      originalUrl: string;
    };
    cost?: number;
  }
  
  export interface ProductQueryParams {
    page: number;
    size: number;
  }
  
  export interface ProductResponse {
    data: Product[];
    currentPage: number;
    totalPages: number;
    total: number;
    size: number;
  }
  