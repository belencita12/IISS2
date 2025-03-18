import VaccineManufacturerForm from "@/components/admin/vaccine/VaccineManufacturerForm";

export default function NewVaccineManufacturerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Fabricante de Vacunas</h1>
      <VaccineManufacturerForm />
    </div>
  );
}