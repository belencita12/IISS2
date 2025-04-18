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

  if(!response.ok){
    let body: { message?: string } | null = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    const detail = body?.message ? `: ${body.message}` : "";

    switch (response.status) {
      case 400:
        throw new Error(`Parámetros inválidos${detail}`);
      case 401:
        throw new Error(`No autorizado: inicia sesión de nuevo`);
      case 403:
        throw new Error(`Acceso denegado${detail}`);
      case 404:
        throw new Error(`No se encontraron movimientos${detail}`);
      case 500:
        throw new Error(`Error interno del servidor`);
      default:
        throw new Error(`Error inesperado${detail}`);
    }
  }

  const data = await response.json();
  return data as PaginationResponse<MovementData>;
};
