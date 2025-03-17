'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Vaccine {
  id: number;
  name: string;
  manufacturer: string;
  species: string;
}

interface VaccineListProps {
  vaccines: Vaccine[];
}

export default function VaccineList({ vaccines }: VaccineListProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fabricante</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVaccines.map((vaccine) => (
            <TableRow key={vaccine.id}>
              <TableCell>{vaccine.name}</TableCell>
              <TableCell>{vaccine.manufacturer}</TableCell>
              <TableCell>{vaccine.species}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/vaccine/${vaccine.id}/edit`)}
                >
                  ✏️
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => console.log('Eliminar', vaccine.id)} // Aquí irá tu lógica real luego
                >
                  🗑️
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
