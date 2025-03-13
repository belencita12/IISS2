import ManufacturerForm from '@/components/admin/VaccineManufacturerForm'
import { createManufacturer } from '@/lib/vaccine-manufacturer/getVaccineManufacturerById'

export default function NewManufacturerPage() {
  return (
    <ManufacturerForm
      mode="create"
      onSubmitHandler={createManufacturer}
    />
  )
}
