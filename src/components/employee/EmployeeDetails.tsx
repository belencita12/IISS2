"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getEmployeeByID } from "@/lib/employee/getEmployeeByID";
import { EmployeeData } from "@/lib/employee/IEmployee";

const EmployeeDetails = ({ token, employeeId }: { token: string; employeeId: number }) => {
    const [employee, setEmployee] = useState<EmployeeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const data = await getEmployeeByID(token, employeeId);
                setEmployee(data);
            } catch (err) {
                setError("Error al cargar los datos del empleado");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [token, employeeId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;
    if (!employee) return <p>No se encontró información del empleado</p>;

    return (
        <div className="p-6 h-full">
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-6 rounded-sm space-y-4 p-2">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Nombre completo: {employee.fullName}</h1>
                        <p><strong>Puesto actual:</strong> {employee.position.name}</p>
                        <p><strong>Correo:</strong> {employee.email}</p>
                    </div>
                    <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                        <Image
                            src={employee.profileImg?.previewUrl || "/coverlg.jpg"}
                            alt={employee.fullName}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;