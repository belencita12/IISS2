import { VACCINE_MANUFACTURER_API } from "@/lib/urls";

export async function createManufacturer(token: string, data: { name: string }) {
  const response = await fetch(VACCINE_MANUFACTURER_API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error al crear fabricante');
  return response.json();
}

export async function updateManufacturer(token: string, id: number, data: { name: string }) {
  const response = await fetch(`${VACCINE_MANUFACTURER_API}/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error al actualizar fabricante');
  return response.json();
}

export async function getManufacturers(token: string, page: number = 1, searchQuery: string = '') {
  const url = new URL(VACCINE_MANUFACTURER_API);
  url.searchParams.append("page", page.toString());
  if (searchQuery) {
    url.searchParams.append("name", searchQuery);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Error al obtener fabricantes');
  return response.json();
}

export async function getManufacturerById(token: string, id: number) {
  const response = await fetch(`${VACCINE_MANUFACTURER_API}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Error al obtener fabricante');
  return response.json();
}

export async function deleteManufacturer(token: string, id: number) {
  const response = await fetch(`${VACCINE_MANUFACTURER_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al eliminar fabricante: ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  const hasBody = contentType && contentType.includes("application/json");

  return hasBody ? await response.json() : null;
}

