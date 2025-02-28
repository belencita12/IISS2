
import type { Metadata, Viewport } from "next";
import { ServiceCard } from "@/components/serviceUi/ServiceCard";
import Carousel from "@/components/serviceUi/Carousel";
import Image from "next/image";
import ObsoleteServices from "@/components/serviceUi/ObsoleteServices";

export const metadata: Metadata = {
    title: "NicoPets",
    description: "Servicios y productos para tus mascotas",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
};

const services = [
    {
        title: "Veterinaria",
        description: "Atención médica para tu mascota.Las reservas online son un sistema muy cómodo que te permite realizar citas veterinarias las 24 horas del día y desde cualquier lugar. Podrás consultar la disponibilidad de clínicas veterinarias de un vistazo, incluso durante tu viaje al trabajo o durante tu pausa del almuerzo",
        image: "/image container (1).png",
        carousel: ["/vet1.png", "/vet2.png", "/pelu1.png", "/pelu2.png"]
    },
    {
        title: "Peluquería",
        description: "Cortes y aseo para tu mascota. Lavar con champú a un gato que odia los baños puede ser todo un desafío.Tu amado gato ha regresado de una escapada, o estás preocupado por el olor o la suciedad alrededor de su parte trasera, así que es hora de darle un champú.",
        image: "/image container (2).png",
        carousel: ["/pelu1.png", "/pelu2.png", "/cast1.png", "/cast2.png"]
    },
    {
        title: "Castración",
        description: "La castración es un procedimiento veterinario seguro y recomendado para prevenir enfermedades y mejorar la calidad de vida de tu mascota. Ayuda a reducir el riesgo de infecciones, evita camadas no deseadas y contribuye a un comportamiento más equilibrado. ",
        image: "/image container (3).png",
        carousel: ["/cast1.png", "/cast2.png", "/vet1.png", "/vet2.png"]
    }
];

export default function Servicios() {
    return (
        <div className="space-y-6 mt-6  w-full px-[6%]">
            <div className="mx-auto w-full">
                <section className="flex items-center gap-5 py-5 bg-white flex-col sm:flex-row">
                    <Image
                        src="/image container.png"
                        alt="Service"
                        width={500}
                        height={300}
                        className="object-contain rounded-md aspect-square sm:w-[28%] w-full"
                    />
                    <div className="text-left flex flex-col gap-5 flex-1">
                        <h2 className="sm:text-3xl text-xl font-bold">Nuestros servicios</h2>
                        <p className="text-gray-600 text-justify">
                        Descubre nuestros nuevos servicios diseñados para el bienestar y cuidado de tu mascota. 🐶🐱

                        Hemos ampliado nuestra oferta para brindarte soluciones más completas y accesibles. Con profesionales altamente capacitados y tecnología de vanguardia, garantizamos la mejor atención para tu compañero de vida. 💖
                        </p>
                        <p className="text-gray-600">
                        Explora nuestras nuevas opciones y dale a tu mascota el cuidado que se merece. ¡Tu tranquilidad y su felicidad son nuestra prioridad! 🏡✨
                        </p>
                    </div>
                </section>
                <ObsoleteServices />
                <div className="space-y-6 mt-6 w-full mx-auto">
                    {services.map((service, index) => (
                        <div key={index}>
                            <ServiceCard
                                title={service.title}
                                description={service.description}
                                image={service.image}
                                alt={`Imagen de ${service.title}`}
                                ctaText="Más información"
                                ctaLink="/service.title"
                            />
                            <Carousel images={service.carousel} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
