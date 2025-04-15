import {Product} from "@/lib/products/IProducts";
import { Movement } from "./IMovements";

export default interface MovementDetails {
    id?: number;
    product: Product;
    movementId: Movement;
    quantity: number;
    }