const services = [
    { name: "Vacunación", image: "/vacunacion.jpg" },
    { name: "Peluquería", image: "/peluqueria.jpg" },
    { name: "Castración", image: "/castracion.jpg" },
  ];
  
  export default function Services() {
    return (
      <section className="py-10">
        <h2 className="text-2xl font-bold text-center mb-6">Nuestros servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {services.map((service) => (
            <div key={service.name} className="bg-white p-4 rounded-lg shadow-lg text-center">
              <img src={service.image} alt={service.name} className="rounded-md mb-4" />
              <h3 className="font-semibold">{service.name}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  }
  