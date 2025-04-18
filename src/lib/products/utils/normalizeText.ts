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
