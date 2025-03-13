const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/vaccine-manufacturer`;

export async function createManufacturer(data: { name: string }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error al crear fabricante');
}

export async function updateManufacturer(id: number, data: { name: string }) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error al actualizar fabricante');
}

export async function getManufacturers(query = '') {
  const response = await fetch(`${API_URL}?${query}`, {
    method: 'GET',
  });

  if (!response.ok) throw new Error('Error al obtener fabricantes');
  return response.json();
}

export async function getManufacturerById(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
  });

  if (!response.ok) throw new Error('Error al obtener fabricante');
  return response.json();
}

export async function deleteManufacturer(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error al eliminar fabricante');
}
