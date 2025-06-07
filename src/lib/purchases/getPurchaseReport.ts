import { ApiError } from "../api";
import { PURCHASE_API } from "../urls";
import { mapToQueryParamsStr } from "../utils";

interface PurchaseReportParams {
  from: string;
  to: string;
  token: string;
}

export const getPurchaseReport = async ({
  token,
  ...params
}: PurchaseReportParams) => {
  const queryParams = mapToQueryParamsStr(params);
  const res = await fetch(`${PURCHASE_API}/report?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    return data as ApiError;
  }
  return await res.blob();
};
