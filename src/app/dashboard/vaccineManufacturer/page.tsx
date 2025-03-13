
import { getManufacturers, deleteManufacturer } from '@/lib/vaccineManufacturer/getVaccineManufacturerById'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ManufacturerListPage() {
  const data = await getManufacturers()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fabricantes de Vacunas</h1>
      <Link href="/admin/fabricantes/new">
        <Button>Nuevo Fabricante</Button>
      </Link>
      <div className="mt-4 space-y-4">
        {data.items.map((item: any) => (
          <div key={item.id} className="border p-4 rounded flex justify-between">
            <div>{item.name}</div>
            <div className="space-x-2">
              <Link href={`/admin/fabricantes/${item.id}/edit`}>
                <Button variant="outline">Editar</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => deleteManufacturer(item.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
