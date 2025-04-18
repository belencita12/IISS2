import { clsx, type ClassValue } from "clsx";
import { KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const blockExtraKeysNumber = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "-" || e.key === "e") e.preventDefault();
};

export const mapToFormData = <T extends object>(obj: T) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      if (value instanceof Date) formData.append(key, value.toISOString());
      else if (value instanceof File) formData.append(key, value);
      else formData.append(key, String(value));
    }
  });
  return formData;
};

export function calcularEdad(fechaNacimiento: string): string {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses = 0;

  const agediff = hoy.getUTCFullYear() - nacimiento.getUTCFullYear();
  let edad = agediff;
  const mesNacimiento = nacimiento.getUTCMonth();
  const diaNacimiento = nacimiento.getUTCDate();
  const mesActual = hoy.getUTCMonth();
  const diaActual = hoy.getUTCDate();

  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }

  if (edad < 1) {
    if (agediff > 0) {
      meses = 12 + mesActual - mesNacimiento;
    } else {
      meses = mesActual - mesNacimiento;
    }
    if (meses === 1) {
      return `${meses} Mes`;
    } else {
      return `${meses} Meses`;
    }
  }

  if (edad === 1) {
    return `${edad} Año`;
  }
  return `${edad} Años`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES");
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+\d{1,3}\d{7,}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Time format RegExp HH:MM 00:00 - 23:59
 */
export const timeFormatRegExp = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * RUC format RegExp 12345678-1 [7-9 digits]-[1-9]
 */
export const rucFormatRegExp = /^\d{7,9}-[1-9]$/;

/**
 * Normaliza un texto eliminando acentos y convirtiéndolo a minúsculas
 * @param text Texto a normalizar
 * @returns Texto normalizado sin acentos y en minúsculas
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD") // Descompone los caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (acentos)
    .toLowerCase() // Convierte a minúsculas
    .trim() // Elimina espacios en blanco al inicio y final
}
