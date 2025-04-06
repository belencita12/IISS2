import { BaseQueryParams } from "../types";
  
  export interface GetMovementQueryParams extends BaseQueryParams {
    type?: string;
    originStockId?: number;
    destinationStockId?: number;
    managerId?: number;
  }

  export interface MovementData {
    id: number;
    description: string;
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
  