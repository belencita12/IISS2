import { Header } from "@/components/profile/Header";
import authOptions from "@/lib/auth/options";
import { getServerSession, User } from "next-auth";
import Image from 'next/image';
import { Button } from "@/components/ui/button";

type ClientDetailsProps = {
    params: {
        id: string;
    };
};

export default async function ClientDetails({ params }: ClientDetailsProps) {
    const token = await getServerSession(authOptions);
    const fullName = token?.user?.fullName || "User";
    const client = {
        fullName: "Lindsey Stroud",
        image: "/userProfile.png",
        email: "lindsey.stroud.@example.com",
    };

    return (
        <>
            <Header fullName={fullName} />
            <section className="flex items-center gap-16 mx-auto px-24 py-12">
                <Image
                    src={client.image}
                    alt={client.fullName}
                    width={250}
                    height={250}
                    className="rounded-full bg-cover w[400px] h[400px]"
                />
               <div>
               <h1 className="text-3xl font-bold text-gray-800">
                    {client.fullName}
                </h1>
                <p className="text-gray-600">{client.email}</p>
               </div>
            </section>
            <section className="mx-auto">
                <div className="flex justify-between items-center px-24">
                    <h2 className="text-xl">Mascotas</h2>
                    <Button variant={"outline"}>Agregar</Button>
                </div>
                <table className="w-full mx-auto px-24">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Max</td>
                            <td>5</td>
                            <td>
                                <Button variant={"secondary"}>Editar</Button>
                                <Button variant={"destructive"}>Eliminar</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </>
    );
}
