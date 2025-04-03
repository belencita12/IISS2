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
    type: string;
    dateMovement: string;
    originStockId: number;
    destinationStockId: number;
    managerId: number;
    createdAt: string;
    updatedAt: string;
    // Ideal: incluir relaciones si las tenés
    originStock?: { name: string };
    destinationStock?: { name: string };
    manager?: { fullName: string; ruc: string };
  }
  