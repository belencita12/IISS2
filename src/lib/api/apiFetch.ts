import { toast } from "../toast";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export interface ApiOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: unknown;
  throwErrors?: boolean; // Si es falso, maneja los errores internamente
  showToast?: boolean; // Si es true, muestra mensajes toast en caso de error
  customErrorMessage?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
  ok: boolean;
}

/**
 * Función utilitaria para realizar peticiones a la API
 * @param url URL a la que se realiza la petición
 * @param token Token de autenticación (opcional)
 * @param options Opciones adicionales para la petición
 * @returns Respuesta tipada según el genérico proporcionado
 */
export async function apiFetch<T>(
  url: string,
  token?: string | null,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {

  const {
    method = "GET",
    headers: customHeaders = {},
    body,
    throwErrors = true,
    showToast = true,
    customErrorMessage,
  } = options;

  // Configurar headers con autenticación si se proporciona un token
  const headers: Record<string, string> = {
    ...customHeaders,
  };

  // Check if token is truly available and valid
  if (token && typeof token === 'string' && token.trim() !== '') {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("No valid token provided to apiFetch");
  }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }


  try {
    // Configurar opciones del fetch
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Añadir body si es necesario
    if (body) {
      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, fetchOptions);
    
    const isJsonResponse = 
      response.headers.get("content-type")?.includes("application/json");

    // Procesar la respuesta según su tipo
    let data = null;
    
    if (isJsonResponse) {
      try {
        data = await response.json();
      } catch (err) {
        console.error("Error parsing JSON response:", err);
      }
    }

    // Si la respuesta no es exitosa, manejar el error
    if (!response.ok) {
      const error: ApiError = new Error(
        customErrorMessage || 
        (data && typeof data === "object" && "message" in data 
          ? data.message 
          : `Error ${response.status}: ${response.statusText}`)
      );
      
      error.status = response.status;
      error.data = data;

      if (showToast) {
        toast(
          "error",
          customErrorMessage || 
          (data && typeof data === "object" && "message" in data 
            ? data.message 
            : `Error en la petición`)
        );
      }

      if (throwErrors) {
        throw error;
      }

      return { 
        data: null, 
        error, 
        status: response.status, 
        ok: false 
      };
    }

    return { 
      data: data as T, 
      error: null, 
      status: response.status, 
      ok: true 
    };
  } catch (err) {
    const error = err as ApiError;
    
    if (showToast && !error.status) { // Evita mostrar dos toast si ya se mostró uno
      toast("error", customErrorMessage || "Error de conexión");
    }
    
    if (throwErrors) {
      throw error;
    }
    
    return {
      data: null,
      error,
      status: error.status || 0,
      ok: false
    };
  }
}