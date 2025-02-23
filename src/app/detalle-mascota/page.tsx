import Image from "next/image";

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  genero: string;
  peso: number;
  profile_img: string;
  fecha_de_nacimiento: string;
  libreta_de_vacunacion_id: number;
  cantidad_de_visitas: number; //atributo temporal, hasta tener fuente real
}

const mascota: Mascota = {
  id: 1,
  nombre: "Enrique",
  especie: "Perro",
  raza: "Labrador",
  genero: "Macho",
  peso: 25.5,
  profile_img: "/imagen-mascota/perro-labrador.jpg",
  fecha_de_nacimiento: "2022-06-15",
  libreta_de_vacunacion_id: 101,
  cantidad_de_visitas: 8,
};

function calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesNacimiento = nacimiento.getMonth();
    const mesActual = hoy.getMonth();
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
}

function convertirFecha(fecha: string): string {
    const meses: string[] = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];
    const año = fechaObj.getFullYear();

    return `${dia} de ${mes} ${año}`;
  }
  

export default function EditarMascota() {
  return (
    <div className="flex-col">
        <div className="flex justify-center bg-gray-500 p-5">
            <div className=" flex-col justify-center items-center p-3 pr-8">
                <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-[3px] border-black flex justify-center items-center">
                    <Image
                        src={mascota.profile_img}
                        alt={mascota.nombre}
                        width={200}
                        height={200}
                        className="object-cover object-center w-full h-full"
                    />
                </div>
                <div className="flex-col p-2 text-black">
                    <p className="flex justify-center font-bold">{mascota.nombre}</p>
                    <p className="flex justify-center text-gray-800 text-xs pb-3">Visitas a la veterinaria: {mascota.cantidad_de_visitas}</p>
                    <p className="flex justify-center font-bold text-xl">{calcularEdad(mascota.fecha_de_nacimiento)} Años</p>
                </div>
            </div>
            <div className="flex-col justify-start text-white text-xs">
                <div className="p-1 pb-3">
                    <p>Nombre</p><p className="text-xl">{mascota.nombre}</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Fecha de Nacimiento</p><p className="text-xl">{convertirFecha(mascota.fecha_de_nacimiento)}</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Raza</p><p className="text-xl">{mascota.raza}</p>
                </div>
                <div className="p-1 pb-3">
                    <p>Animal</p><p className="text-xl">{mascota.especie}</p>
                </div>
                <div className="p-1 pb-4">
                    <p>Genero</p><p className="text-xl">{mascota.genero}</p>
                </div>
                <button className="bg-white text-black text-sm rounded-xl p-2 pr-6 pl-6">Ver Libreta</button>
            </div>
        </div>
        <div className="flex justify-center bg-white">Contenido 2</div>
    </div>
  );
}
