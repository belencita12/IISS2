import EmployeesTable from "@/components/employee/EmployeeList";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function EmployeesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session?.user?.token || null;

    return (
        <div>
            <EmployeesTable token={token} />
        </div>
    );
};
