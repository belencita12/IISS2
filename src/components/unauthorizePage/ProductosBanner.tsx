import { PawPrint, Heart } from "lucide-react";

const ProductosBanner = () => {
  return (
    <section className="relative bg-white overflow-hidden py-16 px-6 text-center">
      {/* Texto principal */}
      <div className="relative z-10">
        <h3 className="text-myPink-primary text-lg font-semibold tracking-widest uppercase">Nuestros</h3>
        <h1 className="text-[60px] font-extrabold text-myPurple-primary leading-none">PRODUCTOS</h1>
        <p className="text-black mt-4 text-sm">@NicoPetspy</p>
      </div>

      {/* Formas decorativas */}
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

        {/* Íconos de huella y corazón */}
        <div className="absolute bottom-6 right-6 z-10">
        <div className="relative w-20 h-20">
          {/* Huella */}
          <PawPrint className="w-full h-full text-gray" />
          {/* Círculo rosado con corazón blanco */}
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-myPink-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
        </div>
        </div>
    </section>
  );
};

export default ProductosBanner;