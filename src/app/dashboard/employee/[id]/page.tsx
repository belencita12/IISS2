import { getEmployeeByID } from "@/lib/employee/getEmployeeByID";
import type { EmployeeData } from "@/lib/employee/IEmployee";
import { notFound } from "next/navigation";
import Image from "next/image";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import AppointmentList from "@/components/admin/appointment/AppointmentListByEmployee";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, FileText, Briefcase } from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const employeeId = Number(resolvedParams.id);

    if (isNaN(employeeId)) return notFound();

    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "";
    const employee: EmployeeData | null = await getEmployeeByID(
        token,
        employeeId
    );

    if (!employee) return notFound();

    return (
        <div className="container py-8 h-full">
            <Card className="mb-8 shadow-md">
                <CardHeader className="pb-0">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Perfil de Empleado
                    </h1>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                        <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-background shadow-lg flex-shrink-0">
                            <Image
                                src={
                                    employee.image?.originalUrl ||
                                    "/default-avatar.png"
                                }
                                alt={employee.fullName}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {employee.fullName}
                                </h2>
                                <Badge className="mt-2" variant="secondary">
                                    <Briefcase className="w-4 h-4 mr-1" />
                                    {employee.position.name}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Correo Electrónico
                                        </p>
                                        <p className="font-medium">
                                            {employee.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            RUC
                                        </p>
                                        <p className="font-medium">
                                            {employee.ruc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader className="pb-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Citas Programadas
                    </h2>
                    <p className="text-muted-foreground">
                        Lista de citas asignadas a este empleado
                    </p>
                </CardHeader>
                <CardContent>
                    {employee ? (
                        <AppointmentList
                            token={token}
                            employeeRuc={employee.ruc}
                        />
                    ) : (
                        <div>Cargando.....</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
