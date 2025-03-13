import ManufacturerForm from '@/components/admin/VaccineManufacturerForm'
import { getManufacturerById, updateManufacturer } from '@/lib/vaccine-manufacturer/getVaccineManufacturerById'

export default async function EditManufacturerPage({ params }: { params: { id: string } }) {
  const manufacturer = await getManufacturerById(+params.id)

  return (
    <ManufacturerForm
      mode="edit"
      initialData={{ name: manufacturer.name }}
      onSubmitHandler={(data) => updateManufacturer(+params.id, data)}
    />
  )
}
