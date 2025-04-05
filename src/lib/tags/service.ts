import { PaginationResponse } from "../types";
import { TAG_API } from "../urls";
import { Tag } from "./types";

export const getAllTags = async (token: string, queryStr?: string) => {
  const response = await fetch(`${TAG_API}?${queryStr}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener etiquetas");
  const data = await response.json();
  return data as PaginationResponse<Tag>;
};

export const registerTag = async (token: string, name: string) => {
  const response = await fetch(TAG_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Error al registrar etiqueta");
  const data = await response.json();
  return data as Tag;
};

export const editTag = async (token: string, id: number, name: string) => {
  const response = await fetch(`${TAG_API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Error al editar etiqueta");
  const data = await response.json();
  return data as Tag;
};

export const deleteTag = async (token: string, id: number) => {
  const response = await fetch(`${TAG_API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al eliminar etiqueta");
  }
};
