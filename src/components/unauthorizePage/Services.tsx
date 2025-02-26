const services = [
    { name: "Vacunación", image: "/image container (1).png" },
    { name: "Peluquería", image: "/image container (2).png" },
    { name: "Castración", image: "/image container (3).png" },
];

export default function Services() {
    return (
        <div>
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
                            Ofrecemos los siguiente servicios.
                        </p>
                    </div>
                </div>
            </section>
            <section className="flex items-center py-10 bg-white">
                <div className="flex justify-between w-full">
                    {services.map((service) => (
                        <div key={service.name} className="bg-white p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer">
                            <img src={service.image} alt={service.name} className="rounded-md mb-4" />
                            <h3 className="font-semibold">{service.name}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
