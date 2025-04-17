// src/lib/products/utils/accent.ts
  
// src/lib/products/utils/accent.ts

/**
 * Normaliza un texto eliminando acentos, convirtiendo a minúsculas y opcionalmente eliminando espacios
 * @param texto Texto original a normalizar
 * @param eliminarEspacios Si es true, elimina todos los espacios del texto
 * @returns Texto normalizado sin acentos y en minúsculas
 */
export function normalizarTexto(texto: string, eliminarEspacios: boolean = false): string {
    if (!texto) return '';
    
    let normalizado = texto
      .normalize("NFD")                   // Descompone los caracteres con acento
      .replace(/[\u0300-\u036f]/g, "")    // Elimina los acentos
      .toLowerCase();                     // Convierte a minúsculas
    
    if (eliminarEspacios) {
      normalizado = normalizado.replace(/\s+/g, ""); // Elimina espacios
    }
    
    return normalizado;
  }
  
  /**
   * Compara dos textos ignorando acentos, mayúsculas y opcionalmente espacios
   * @param texto1 Primer texto a comparar
   * @param texto2 Segundo texto a comparar
   * @param eliminarEspacios Si es true, elimina espacios antes de comparar
   * @returns true si los textos son iguales ignorando acentos y mayúsculas
   */
  export function compararTextoSinAcentos(texto1: string, texto2: string, eliminarEspacios: boolean = false): boolean {
    return normalizarTexto(texto1, eliminarEspacios) === normalizarTexto(texto2, eliminarEspacios);
  }
  
  /**
   * Verifica si un texto contiene otro, ignorando acentos y mayúsculas
   * @param textoCompleto Texto en el que buscar
   * @param textoBuscado Texto a encontrar
   * @param eliminarEspacios Si es true, elimina espacios antes de comparar
   * @returns true si textoBuscado está contenido en textoCompleto, ignorando acentos y mayúsculas
   */
  export function contieneSinAcentos(textoCompleto: string, textoBuscado: string, eliminarEspacios: boolean = false): boolean {
    return normalizarTexto(textoCompleto, eliminarEspacios).includes(normalizarTexto(textoBuscado, eliminarEspacios));
  }
  
  /**
   * Filtra un array de objetos por una propiedad de texto, ignorando acentos
   * @param items Array de objetos a filtrar
   * @param propiedad Nombre de la propiedad por la que filtrar
   * @param textoBuscado Texto a buscar
   * @param eliminarEspacios Si es true, elimina espacios antes de comparar
   * @returns Array filtrado de objetos que contienen el texto buscado en la propiedad especificada
   */
  export function filtrarPorTextoSinAcentos<T>(
    items: T[], 
    propiedad: keyof T, 
    textoBuscado: string,
    eliminarEspacios: boolean = false
  ): T[] {
    if (!textoBuscado) return items;
    
    return items.filter(item => {
      const valorPropiedad = String(item[propiedad] || '');
      return contieneSinAcentos(valorPropiedad, textoBuscado, eliminarEspacios);
    });
  }