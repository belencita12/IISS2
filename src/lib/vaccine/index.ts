export async function getVaccines(token: string, query = 'page=1') {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine?${query}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Error al obtener vacunas');

  return response.json();
}
