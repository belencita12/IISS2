'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getVaccines } from '@/lib/vaccine/index'; // Fetch real
import { toast } from '@/lib/toast';

interface Vaccine {
  id: number;
  name: string;
  manufacturer: { name: string };
  species: { name: string };
}

interface VaccineListProps {
  token: string;
}

export default function VaccineList({ token }: VaccineListProps) {
  const [search, setSearch] = useState('');
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (token) fetchVaccines();
  }, [token]);

  const fetchVaccines = async () => {
    setIsLoading(true);
    try {
      const data = await getVaccines(token, 'page=1'); 
      if (Array.isArray(data.data)) {
        setVaccines(data.data);
      } else {
        setVaccines([]); // Si no es un array, asignar un array vacío
      }
    } catch (error) {
      toast('error', 'Error al obtener vacunas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVaccines = vaccines.filter((vaccine) =>
    vaccine.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button onClick={() => router.push('/dashboard/vaccine/new')}>Agregar</Button>
      </div>

      {isLoading ? (
        <p className="text-center">Cargando vacunas...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead className="text-right">Acciones</TableHead> {/* Alineado a la derecha */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVaccines.length > 0 ? (
              filteredVaccines.map((vaccine) => (
                <TableRow key={vaccine.id}>
                  <TableCell>{vaccine.name}</TableCell>
                  <TableCell>{vaccine.manufacturer.name}</TableCell>
                  <TableCell>{vaccine.species.name}</TableCell>
                  <TableCell className="text-right"> {/* Alineado a la derecha */}
                    <div className="flex justify-end space-x-2"> {/* Contenedor flexible para los botones */}
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/vaccine/${vaccine.id}/edit`)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => console.log('Eliminar', vaccine.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay vacunas registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}