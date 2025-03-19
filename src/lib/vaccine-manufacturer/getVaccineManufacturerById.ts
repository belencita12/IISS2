const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine-manufacturer`;

export async function createManufacturer(token: string, data: { name: string }) {
  const response = await fetch(API_URL, {
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
  const response = await fetch(`${API_URL}/${id}`, {
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

export async function getManufacturers(token: string, query = '') {
  const response = await fetch(`${API_URL}?${query}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Error al obtener fabricantes');
  return response.json();
}

export async function getManufacturerById(token: string, id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Error al obtener fabricante');
  return response.json();
}

export async function deleteManufacturer(token: string, id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Error al eliminar fabricante');
  return response.json();
}
