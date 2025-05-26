import Image from "next/image";
const services = [
    { name: "Vacunación", Image: "/vac1.jpg" },
    { name: "Peluquería", Image: "/peluq1.jpg" },
    { name: "Castración", Image: "/veterinaria9.jpg" },
];

export default function Services() {
    return (
        <>
            <section className="flex items-center gap-5 py-5 bg-white">
                <Image
                    src="/veterinarios1.jpg"
                    alt="Service"
                    width={150}
                    height={150}
                    className="object-contain rounded-md aspect-square sm:w-[25%] w-[40%]"
                />
                <div className="text-left flex flex-col gap-5 flex-1">
                    <h2 className="sm:text-3xl text-xl font-bold text-myPurple-primary">Nuestros servicios</h2>
                    <p className="text-gray-600">
                        Ofrecemos los siguiente servicios.
                    </p>
                </div>
            </section>
            <section className="flex sm:flex-row flex-col items-center justify-between py-10 bg-white gap-4">
                {services.map((service) => (
                    <div key={service.name} className="flex-1 w-full bg-myPink-disabled p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-row sm:flex-col items-center gap-4">
                        <Image
                            src={service.Image}
                            alt={service.name}
                            width={300}
                            height={300}
                            quality={100}
                            className="h-auto rounded-md sm:w-[90%] w-[30%] aspect-square object-cover" />
                        <h3 className="font-semibold text-sm text-myPink-primary">{service.name}</h3>
                    </div>
                ))}
            </section>
        </>
    );
}
