import { getEmployeeByID } from "@/lib/employee/getEmployeeByID";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { notFound } from "next/navigation";
import Image from "next/image";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const employeeId = Number(resolvedParams.id);

  if (isNaN(employeeId)) return notFound();

  const session = await getServerSession(authOptions);
  const token = session?.user?.token || "";
  const employee: EmployeeData | null = await getEmployeeByID(token, employeeId);

  if (!employee) return notFound();

  return (
    <div className="p-6 h-full">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-6 rounded-sm space-y-4 p-2">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Nombre completo: {employee.fullName}</h1>
            <p><strong>Puesto actual:</strong> {employee.position.name}</p>
            <p><strong>Correo:</strong> {employee.email}</p>
            <p><strong>RUC:</strong> {employee.ruc}</p>
          </div>
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
            <Image
              src={employee.image?.originalUrl || "/default-avatar.png"}
              alt={employee.fullName}
              width={300}  
              height={300}
              className="w-full h-full object-cover"
            />
            </div>
        </div>
      </div>
    </div>
  );
}
