export type MovementType = "INBOUND" | "OUTBOUND" | "TRANSFER";

export interface MovementDetail {
  productId: number;
  quantity: number;
}

export interface MovementRequest {
    description: string;
    managerId: number;
    type: MovementType;
    dateMovement: string; // formato ISO: YYYY-MM-DDTHH:mm:ss
    originStockId: number;
    destinationStockId: number;
    details: MovementDetail[];
}
  
export interface MovementResponse {
    id: number;
    description: string;
    managerId: number;
    type: MovementType;
    dateMovement: string;
    originStockId: number;
    destinationStockId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | Record<string, never>;
}

export interface MovementProductItem {
  productId: string; // viene de Product.id
  code: string;
  name: string;
  quantity: number;
}
