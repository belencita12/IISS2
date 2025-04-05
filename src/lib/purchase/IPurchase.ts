import { Provider } from "../provider/IProvider";
import { StockData } from "../stock/IStock";
import { BaseQueryParams } from "../types";

    export interface PurchaseData {
        id?: number;
        ivaTotal: number;
        total: number;
        date?: string;
        provider: Provider;
        stock: StockData;
        }

    export interface GetPurchaseQueryParams extends BaseQueryParams {
        providerId?: number;
        stockId?: number;

    }