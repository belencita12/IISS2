import { ApiError } from "../api";
import { PET_API } from "../urls";
import { mapToQueryParamsStr } from "../utils";

interface PetReportParams {
  speciesId?: number;
  from: string;
  to: string;
  token: string;
}

export const getPetReport = async ({ token, ...params }: PetReportParams) => {
  const queryParams = mapToQueryParamsStr(params);
  const res = await fetch(`${PET_API}/report?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    return data as ApiError;
  }
  return await res.blob();
};
