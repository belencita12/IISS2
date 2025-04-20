import {Product} from "@/lib/products/IProducts";
import { Movement } from "./IMovements";
import { BaseQueryParams } from "../types";

export default interface MovementDetails {
    id?: number;
    product: Product;
    movementId: Movement;
    quantity: number;
    }

    export interface GetMovementDetailsQueryParams extends BaseQueryParams {
        movementId?: number;
      }
      