import EmployeeUpdateForm from "@/components/employee/update/EmployeeUpdateForm";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EmployeeUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const employeeId = Number(resolvedParams.id);

  if (isNaN(employeeId)) {
    redirect("/dashboard/employee");
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session.user.token;

  return <EmployeeUpdateForm token={token} employeeId={employeeId} />;
}