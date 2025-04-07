import { PaginationResponse } from "../types";
import { MOVEMENTS_API } from "../urls";
import { MovementData } from "./IMovements";


export const getMovements = async (token: string, queryParamsStr?: string) => {
  const url = `${MOVEMENTS_API}?${queryParamsStr ?? ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data as PaginationResponse<MovementData>;
};
