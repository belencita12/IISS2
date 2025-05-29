import { RECEIPT_API } from "@/lib/urls";
import { IReceiptResponse } from "./IReceipt";

export async function getReceipts(
  token: string,
  queryParamsStr?: string
): Promise<IReceiptResponse> {
  const url = `${RECEIPT_API}${queryParamsStr ? `?${queryParamsStr}` : ""}`;

  const res = await fetch(url, {
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
