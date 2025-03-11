import EmployeeForm from "@/components/employee/EmployeeForm";

export default function EmployeesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Empleado</h1>
      <EmployeeForm />
    </main>
  );
}
