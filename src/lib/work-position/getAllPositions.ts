import { WORK_POSITION_API } from "@/lib/urls";

// Obtener lista paginada de puestos con filtros opcionales
export async function getWorkPositions(
  token: string,
  page: number = 1,
  size: number = 10,
  filters: {
    name?: string;
    weekDay?: number;
    startTimeFrom?: string;
    startTimeTo?: string;
    endTimeFrom?: string;
    endTimeTo?: string;
    includeDeleted?: boolean;
  } = {}
) {
  const url = new URL(WORK_POSITION_API);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("size", size.toString());

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value.toString());
    }
  });

  try {
    //console.log("GET URL:", url.toString());
    //console.log("Token:", token);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) return null;

     if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }



    return await response.json();
  } catch (error) {
    throw error;
  }
}
