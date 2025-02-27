import Image from "next/image";
const services = [
    { name: "Vacunación", image: "/image container (1).png" },
    { name: "Peluquería", image: "/image container (2).png" },
    { name: "Castración", image: "/image container (3).png" },
];

export default function Services() {
    return (
        <>
            <section className="flex items-center gap-5 py-5 bg-white">
                    <Image
                        src="/image container.png"
                        alt="Service"
                        width={150}
                        height={150}
                        className="object-contain rounded-md aspect-square sm:w-[25%] w-[40%]"
                    />
                    <div className="text-left flex flex-col gap-5 flex-1">
                        <h2 className="sm:text-3xl text-xl font-bold">Nuestros servicios</h2>
                        <p className="text-gray-600">
                            Ofrecemos los siguiente servicios.
                        </p>
                    </div>
            </section>
            <section className="flex items-center py-10 bg-white">
                <div className="flex justify-between w-full">
                    {services.map((service) => (
                        <div key={service.name} className="bg-white flex-1 p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer">
                            <img src={service.image} alt={service.name} className="rounded-md mb-4" />
                            <h3 className="font-semibold text-sm">{service.name}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
