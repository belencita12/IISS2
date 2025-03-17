import EmployeeDetails from "@/components/employee/EmployeeDetails";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function EmployeePage({ params }: { params: { id?: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (!params?.id) {
        return <p>ID de empleado no proporcionado</p>;
    }

    const employeeId = Number(params.id);

    if (isNaN(employeeId)) {
        return <p>ID de empleado no válido</p>;
    }

    return (
        <div>
            <EmployeeDetails token={session.user.token} employeeId={employeeId} />
        </div>
    );
}
