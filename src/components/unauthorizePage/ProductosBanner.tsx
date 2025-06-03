import { PawPrint, Heart } from "lucide-react";
import Image from "next/image";

const ProductosBanner = () => {
  return (
    <section className="relative bg-white overflow-hidden py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-8 relative z-10">
        {/* Imagen a la izquierda */}
        <div className="w-full sm:w-2/5 relative">
          <div className="relative w-full aspect-square max-w-[280px] mx-auto">
            <div className="relative w-full h-full">
              <Image
                src="/productos9.jpg"
                alt="Productos"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Contenido a la derecha */}
        <div className="w-full sm:w-3/5 text-center sm:text-left relative">
          <div>
            <h3 className="text-myPink-primary text-sm sm:text-lg font-semibold tracking-widest uppercase pl-12">Nuestros</h3>
            <h1 className="text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-extrabold text-myPurple-primary leading-none mt-2">PRODUCTOS</h1>
            <p className="text-black mt-4 text-xs sm:text-sm pl-24">@NicoPetspy</p>
          </div>
          {/* Íconos decorativos */}
          <div className="absolute -top-4 right-1/4 w-16 h-16">
            <div className="transform -rotate-30">
              <PawPrint className="w-full h-full text-gray-300 fill-current drop-shadow-lg" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-myPink-primary flex items-center justify-center shadow-lg">
              <Heart className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Formas decorativas de fondo */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="#f9c5d1"
            d="M0,224L80,224C160,224,320,224,480,202.7C640,181,800,139,960,122.7C1120,107,1280,117,1360,122.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
          <path
            fill="#dda7f3"
            fillOpacity="0.7"
            d="M0,288L120,256C240,224,480,160,720,138.7C960,117,1200,139,1320,149.3L1440,160L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ProductosBanner;