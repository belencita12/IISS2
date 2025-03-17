export async function getVaccines(query = '') {
    // ⚙️ Datos simulados para desarrollo (mock)
    return {
      items: [
        { id: 1, name: 'Tri-felina', manufacturer: 'SimioLabs', species: 'Gato' },
        { id: 2, name: 'NitroVac', manufacturer: 'Laboratorio tateti', species: 'Gato' },
        { id: 3, name: 'Vac-Sules', manufacturer: 'Laboratorios Niconi', species: 'Gato' },
        { id: 4, name: 'Rabimic', manufacturer: 'Los Rusos S.A.', species: 'Perro' },
        { id: 5, name: 'Novixac', manufacturer: 'Jane Doe', species: 'Perro' },
      ],
    };
  }
  

  
 // ⚙️ Código real cuando esté lista la API
  /*
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vaccine?${query}`);
  if (!response.ok) throw new Error('Error al obtener vacunas');
  return response.json();
  */