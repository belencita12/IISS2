import { Invoice } from "./IInvoice";
import { INVOICE_API } from "../urls";
import { PaginationResponse } from "../types";

export const getInvoice = async (token: string, queryParamsStr?: string) => {
  const url = `${INVOICE_API}?${queryParamsStr ?? ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data as PaginationResponse<Invoice>;
};
