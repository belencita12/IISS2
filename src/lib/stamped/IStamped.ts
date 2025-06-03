import { BaseQueryParams } from "../types";

export interface Stamped {
  id: number;
  stampedNum: string;
  stock: {
    id: number;
    name: string;
    address: string;
  };
  fromDate: string;
  toDate: string;
  fromNum: number;
  toNum: number;
  currentNum: number;
  isActive: boolean;
}

export interface StampedQueryParams {
  page: number;
  size: number;
  fromDate?: string;
  toDate?: string;
  stamped?: string;
  stockId?: number;
  includeDeleted?: boolean;
} 