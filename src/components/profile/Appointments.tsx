"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, Syringe} from "lucide-react";
import { useRouter } from "next/navigation";

export const Appointments = () => {
    const router = useRouter();
    const appointments = [
        {
            id: 1,
            title: "Control Veterinario",
            date: "23/09/2022",
            time: "9:00 AM",
            icon: <CalendarIcon className="w-10 h-10 text-gray-700" />,
        },
        {
            id: 2,
            title: "Vacunación",
            date: "15/10/2022",
            time: "11:30 AM",
            icon:  <Syringe className="w-10 h-10 text-gray-700" />,
        },
    ];

    return (
        <section className="max-w-5xl mx-auto mt-10 p-6 bg-white">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Citas Agendadas</h2>

                <Button
                 className="mt-2 flex items-center gap-2"
                 onClick={() => router.push("/user-profile/appointment/register")}
                    >
                        <CalendarIcon className="w-5 h-5" />
                        Agendar una cita
                        
                </Button>

            </div>

            <div className="mt-6">
                {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center py-4 border-b">
                        <div className="flex items-center gap-4">
                        {appointment.icon}
                            <div>
                                <p className="font-semibold">{appointment.title}</p>
                                <p className="text-gray-500 text-sm">{appointment.date}</p>
                            </div>
                        </div>
                        <p className="font-medium flex items-center gap-2">
                            <ClockIcon className="w-5 h-5" />
                            {appointment.time}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
