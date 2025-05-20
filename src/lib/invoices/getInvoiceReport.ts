import { ApiError } from "../api";
import { INVOICE_API } from "../urls";
import { mapToQueryParamsStr } from "../utils";

interface PetReportParams {
  Cliend?: number;
  from: string;
  to: string;
  token: string;
}

export const getInvoiceReport = async ({ token, ...params }: PetReportParams) => {
  const queryParams = mapToQueryParamsStr(params);
  const res = await fetch(`${INVOICE_API}/report?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    return data as ApiError;
  }
  return await res.blob();
};
