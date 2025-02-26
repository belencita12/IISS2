
import { Card } from "@/components/global/Card";
import ClientCarousel from "@/components/serviseUi/Carousel";

const services = [
    {
        title: "Veterinaria",
        description: "Atención médica para tu mascota.",
        image: "/images/veterinaria.jpg",
        carousel: ["/images/vet1.jpg", "/images/vet2.jpg"]
    },
    {
        title: "Peluquería",
        description: "Cortes y aseo para tu mascota.",
        image: "/images/peluqueria.jpg",
        carousel: ["/images/pelu1.jpg", "/images/pelu2.jpg"]
    },
    {
        title: "Guardería",
        description: "Cuidado diario para tu mascota.",
        image: "/images/guarderia.jpg",
        carousel: ["/images/guard1.jpg", "/images/guard2.jpg"]
    }
];

export default function Servicios() {
    return (
        <div className="px-[6%]">
            <main className="p-6">
            <section className="flex items-center justify-between py-5 bg-white">
                <div className="flex items-center gap-5">

                    <img
                        src="/image container.png"
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
                                ctaLink="/servicios"
                            />
                            <ClientCarousel images={service.carousel} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
