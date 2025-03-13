import ManufacturerForm from '@/components/admin/VaccineManufacturerForm'
import { createManufacturer } from '@/lib/vaccineManufacturer/getVaccineManufacturerById'

export default function NewManufacturerPage() {
  return (
    <ManufacturerForm
      mode="create"
      onSubmitHandler={createManufacturer}
    />
  )
}
