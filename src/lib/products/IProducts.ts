export interface Product {
    id: string;
    code: string;
    name: string;
    description?:string;
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
    quantity: number;
  }

  export interface ProductWithExtraData extends Product {
    quantity: number;
    total: number;
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
  