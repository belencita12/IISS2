import Image from "next/image";
import { FC } from "react";
import { PawPrint, Syringe, Scissors } from "lucide-react"; // Usa lucide-react o puedes cambiar por imágenes

const services = [
  {
    name: "Castración",
    icon: <Scissors size={32} className="text-myPink-primary" />,
    style:
      "bg-white border-2 border-pink-300 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 drop-shadow-[2px_2px_0px_#ffffff]",
  },
  {
    name: "Vacunación",
    icon: <Syringe size={32} className="text-myPink-secondary" />,
    style:
      "bg-pink-200 text-white drop-shadow-[2px_2px_0px_#a4c6ff]",
  },
  {
    name: "Peluquería",
    icon: <PawPrint size={32} className="text-myPink-secondary" />,
    style:
      "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600 drop-shadow-[2px_2px_0px_#ffffff]",
  },
];

const Services1: FC = () => {
  return (
    <section className="py-12 px-4 bg-[#fff0f5] text-center">
      <h2 className="text-4xl font-bold text-pink-500 mb-2 flex justify-center items-center gap-2">
        <span className="text-xl">Nuestros</span> SERVICIOS
      </h2>
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex-1 max-w-sm bg-white p-6 rounded-lg shadow-md border hover:scale-105 transition-transform duration-200"
          >
            <div className="mb-2">{service.icon}</div>
            <h3 className={`text-2xl font-extrabold uppercase ${service.style}`}>
              {service.name}
            </h3>
            <p className="mt-2 text-sm text-myPurple-hover leading-5">
              lorem ipsum dolor sit<br />
              adipiscing elit sed<br />
              do eiusmod tempor
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services1;