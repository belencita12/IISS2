import Link from 'next/link'

export default function Hero() {
    return (
        <section className="flex items-center justify-around py-10 sm:flex-row flex-col sm:align-middle">
            <div className="text-center mr-8">
                <h2 className="text-3xl font-bold mb-4">¡Bienvenido a nuestra plataforma!</h2>
                <p className="text-gray-600 mb-6">
                    Regístrate con nosotros y accede a una amplia gama de servicios para tu mascota.
                </p>
                <div className="flex justify-center py-2 h-20">
                    <Link href="/register" >
                        <button className="bg-white text-black px-4 py-2 rounded-lg mr-4 border border-black hover:brightness-90 cursor-pointer transition-all duration-300 text-base sm:text-lg h-full sm:h-auto">
                            Registrarse
                        </button>
                    </Link>
                    <Link href="/login" >
                        <button className="bg-black  text-white px-4 py-2 rounded-lg hover:brightness-110 cursor-pointer transition-all duration-300 text-[base] sm:text-lg">
                            Iniciar Sesion
                        </button>
                    </Link>
                </div>
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
  