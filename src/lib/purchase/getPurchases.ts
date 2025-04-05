import { PaginationResponse } from "../types";
import { PurchaseData } from "./IPurchase";
import {PURCHASE_API} from "../urls";

export const getPurchases = async (token: string, queryParamsStr?: string) => {
  const url = `${PURCHASE_API}?${queryParamsStr ?? ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data as PaginationResponse<PurchaseData>;
};
