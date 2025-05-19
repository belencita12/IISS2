import { getEmployeeByID } from "@/lib/employee/getEmployeeByID";
import type { EmployeeData } from "@/lib/employee/IEmployee";
import { notFound } from "next/navigation";
import Image from "next/image";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import AppointmentList from "@/components/admin/appointment/AppointmentListByEmployee";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, FileText, Briefcase, MapPin, Phone } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            <div className="mb-6 mt-4 px-6">
                <Link href="/dashboard/employee">
                    <Button
                        variant="outline"
                        className="border-black border-solid"
                    >
                        Volver
                    </Button>
                </Link>
            </div>

            <Card className="mb-8 shadow-md w-full relative">
                <CardHeader className="pb-0">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Perfil de Empleado
                    </h1>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                        <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-background shadow-lg flex-shrink-0">
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

                        <div className="flex-1 space-y-4 w-full">
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
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            RUC
                                        </p>
                                        <p className="font-medium truncate">
                                            {employee.ruc}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Correo Electrónico
                                        </p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <p className="font-medium truncate">
                                                        {employee.email}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{employee.email}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Teléfono
                                        </p>
                                        <p className="font-medium truncate">
                                            {employee.phoneNumber}
                                        </p>
                                    </div>
                                </div>

                                {employee.adress && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-muted-foreground">
                                                Dirección
                                            </p>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <p className="font-medium truncate">
                                                            {employee.adress}
                                                        </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{employee.adress}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-12">
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
