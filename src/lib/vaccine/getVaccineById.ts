// lib/vaccine/getVaccineById.ts
export async function getVaccineById(token: string, id: number) {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine/${id}`);
  
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      console.error("Error en la respuesta de la API:", response.status, response.statusText);
      throw new Error("Error al obtener la vacuna");
    }
  
    const data = await response.json();
    console.log("Respuesta de la API (getVaccineById):", data); 
    return data;
  }
  