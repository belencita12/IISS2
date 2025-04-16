
import { BaseQueryParams } from "../types";
  
  export interface GetMovementQueryParams extends BaseQueryParams {
    type?: string;
    originStockId?: number;
    destinationStockId?: number;
    managerId?: number;
    productName?: string;
  }

  export interface MovementData {
    id?: number;
    description?: string;
    type: "INBOUND" | "OUTBOUND" | "TRANSFER" ;
    dateMovement: string;
    originStock?: { id: number; name: string };
    destinationStock?: { id: number; name: string };
    manager?: {
      id: number;
      fullName: string;
      ruc: string;
    };
  }
  export interface Movement {
    id?: number;
    type: "INBOUND" | "OUTBOUND" | "TRANSFER";
    dateMovement: string;
    description?: string;
    originStockId?: number;
    destinationStockId?: number;
    managerId: number;
    details: MovementDetail[];
  }
  
  export interface MovementDetail {
    productId: number;
    quantity: number;
  }
  
  export type ExtendedMovementDetail = MovementDetail & {
    code?: string;
    name?: string;
  };
  
  export type ExtendedMovement = Omit<Movement, "details"> & {
    details: ExtendedMovementDetail[];
  };