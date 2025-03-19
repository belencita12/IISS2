export async function getVaccines(
  token: string,
  page: number = 1,
  searchParams: { name?: string; speciesId?: number; manufacturerId?: number } = {}
) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine`);
  url.searchParams.append("page", page.toString());

  if (searchParams.name) {
    url.searchParams.append("name", searchParams.name);
  }
  if (searchParams.speciesId) {
    url.searchParams.append("speciesId", searchParams.speciesId.toString());
  }
  if (searchParams.manufacturerId) {
    url.searchParams.append("manufacturerId", searchParams.manufacturerId.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error en la respuesta de la API:", response.status, response.statusText);
    throw new Error("Error al obtener vacunas");
  }

  const data = await response.json();
  console.log("Respuesta de la API:", data); // Inspecciona la estructura de la respuesta
  return data;
}