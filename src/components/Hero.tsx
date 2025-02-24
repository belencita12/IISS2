export default function Hero() {
    return (
      <section className="flex items-center justify-center py-10 bg-white">
        <div className="text-center mr-8">
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido a nuestra plataforma!</h2>
          <p className="text-gray-600 mb-6">
            Regístrate con nosotros y accede a una amplia gama de servicios para tu mascota.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-4">Registrarse</button>
          <button className="bg-gray-300 px-4 py-2 rounded-lg">Más detalles</button>
        </div>
        <img 
          src="/image.png" 
          alt="Logo1" 
          width={300} 
          height={300} 
          className="object-contain"
        />
      </section>
    );
  }
  