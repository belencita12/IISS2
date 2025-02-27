
import { Card } from "@/components/global/Card";
import Carousel from "@/components/serviseUi/Carousel";
import Image from "next/image";

const services = [
    {
        title: "Veterinaria",
        description: "Atención médica para tu mascota.",
        image: "/veterinaria.png",
        carousel: ["/vet1.png", "/vet2.png"]
    },
    {
        title: "Peluquería",
        description: "Cortes y aseo para tu mascota.",
        image: "/peluqueria.png",
        carousel: ["/pelu1.png", "/pelu2.png"]
    },
    {
        title: "Castracion",
        description: "Cuidado diario para tu mascota.",
        image: "/guarderia.png",
        carousel: ["/cast1.png", "/cast2.png"]
    }
];

export default function Servicios() {
    return (
        <div className="px-[6%]">
            <main className="p-6">
            <section className="flex items-center justify-between py-5 bg-white">
                <div className="flex items-center gap-5">

                    <Image
                        src="/container.png"
                        alt="Service"
                        width={150}
                        height={150}
                        className="object-contain rounded-md"
                    />
                    <div className="text-left">
                        <h2 className="text-3xl font-bold mb-4">Nuestros servicios</h2>
                        <p className="text-gray-600 mb-6">
                            Ofrecemos los siguientes  servicios.
                        </p>
                    </div>
                </div>
            </section>

                <div className="space-y-6 mt-6">
                    {services.map((service, index) => (
                        <div key={index}>
                            <Card
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
            </main>
        </div>
    );
}
