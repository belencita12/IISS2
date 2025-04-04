
import { Provider } from "../provider/IProvider";
import { StockData } from "../stock/IStock";

export interface PurchaseData {
    id?: number;
    ivaTotal: number;
    total: number;
    date?: string;
    provider: Provider;
    stock: StockData;
    }