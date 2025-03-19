// lib/vaccine-manufacturer/getManufacturers.ts
export async function getManufacturers(token: string): Promise<{ id: number; name: string }[]> {
    let allManufacturers: { id: number; name: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/vaccine-manufacturer?page=${page}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener fabricantes");
        }

        const data = await response.json();
        allManufacturers = [...allManufacturers, ...data.data]; // Combina los resultados

        // Verifica si hay más páginas
        if (data.data.length === 0 || data.currentPage >= data.totalPages) {
            hasMore = false;
        } else {
            page++;
        }
    }

    return allManufacturers;
}