import { RECEIPT_API } from "@/lib/urls";
import { IReceiptResponse } from "./IReceipt";

export async function getReceipts(
  token: string,
  params?: Record<string, string | number>
): Promise<IReceiptResponse> {
  const queryParams: Record<string, string | number> = {
    ...params,
    page: params && "page" in params ? params.page : 1,
  };

  const query = "?" + new URLSearchParams(queryParams as Record<string, string>).toString();

  const res = await fetch(`${RECEIPT_API}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener los recibos");
  }

  const data: IReceiptResponse = await res.json();
  return data;
}