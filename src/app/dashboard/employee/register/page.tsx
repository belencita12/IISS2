import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import EmployeeForm from "@/components/employee/register/EmployeeForm";

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";

  if (!token) return <p>Cargando...</p>;

  return (
    <main className="py-6 px-20">
      <EmployeeForm token={token} />
    </main>
  );
}