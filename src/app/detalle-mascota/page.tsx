import Image from "next/image";

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  peso: number;
  profile_img?: string;
  fecha_de_nacimiento: string;
  libreta_de_vacunacion_id: number;
}

const mascota: Mascota = {
  id: 1,
  nombre: "Enrique",
  especie: "Perro",
  raza: "Labrador",
  peso: 25.5,
  profile_img: "/imagen-mascota/perro-labrador.jpg",
  fecha_de_nacimiento: "2022-06-15",
  libreta_de_vacunacion_id: 101,
};

export default function EditarMascota() {
  return (
    <div className="flex flex-col items-center">
    <div className="flex p-8">
        {/* Imagen, Nombre y Fecha de Nacimiento */}
        <div className="mr-8">
            {mascota.profile_img && (
            <Image
                src={mascota.profile_img}
                alt={mascota.nombre}
                width={180}
                height={150}
                className="rounded-full border"
            />
            )}
        </div>
        <div className="text-left">
            <h1 className="text-2xl font-bold">{mascota.nombre}</h1>
            <p className="text-gray-600">Fecha de Nacimiento: {mascota.fecha_de_nacimiento}</p>
        </div>
    </div>
    <div>
        {/* Tabla con detalles de la mascota */}
        <table className="mt-6 border-collapse border border-gray-300 w-[500px] h-[300px] text-left">
            <tbody>
                <tr>
                    <td className="border px-4 py-2 font-semibold">Especie</td>
                    <td className="border px-4 py-2">{mascota.especie}</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2 font-semibold">Raza</td>
                    <td className="border px-4 py-2">{mascota.raza}</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2 font-semibold">Peso</td>
                    <td className="border px-4 py-2">{mascota.peso} kg</td>
                </tr>
                <tr>
                    <td className="border px-4 py-2 font-semibold">Libreta de Vacunación</td>
                    <td className="border px-4 py-2">{mascota.libreta_de_vacunacion_id}</td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
  );
}
