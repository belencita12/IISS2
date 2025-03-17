import VaccineList from '@/components/admin/VaccineList';
import { getVaccines } from '@/lib/vaccine/index'; // Cambia la ruta si luego decides moverlo a /vaccine/

export default async function VaccineListPage() {
  // Aquí consumimos los datos
  const data = await getVaccines();

  return <VaccineList vaccines={data.items} />;
}
