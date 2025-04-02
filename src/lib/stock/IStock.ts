import {Product} from "@/lib/products/IProducts"

export interface StockData {
    id?: number;
    name: string;
    address: string;
  }
  
  export interface StockResponse {
    data: StockData[];
    total: number;
    size: number;
    prev: boolean;
    next: boolean;
    currentPage: number;
    totalPages: number;
  }
  
  export interface StockQueryParams {
    page?: number;
    size?: number;
    from?: string;
    to?: string;
    includeDeleted?: boolean;
    name?: string;
    address?: string;
  }
  
  export interface StockDetailsData {
    stockId: number;
    product: Product;
    amount: number;
  }
  
  export interface StockDetailsResponse {
    data: StockDetailsData[];
    total: number;
    size: number;
    prev: boolean;
    next: boolean;
    currentPage: number;
    totalPages: number;
  }