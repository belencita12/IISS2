import { ApiError } from "../api";
import { CLIENT_API } from "../urls";
import { mapToQueryParamsStr } from "../utils";

interface ClientReportParams {
  from: string;
  to: string;
  token: string;
}

export const getClientReport = async ({
  token,
  ...params
}: ClientReportParams) => {
  const queryParams = mapToQueryParamsStr(params);
  const res = await fetch(`${CLIENT_API}/report?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    return data as ApiError;
  }
  return await res.blob();
};
