
import type { Metadata, Viewport } from "next";
import { ProductCard } from "@/components/productUi/ProductCard";
import Carousel from "@/components/productUi/Carousel";
import Image from "next/image";



export const metadata: Metadata = {
    title: "NicoPets",
    description: "Productos y productos para tus mascotas",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
};

const products = [
    {
        title: "Alimentos",
        description: "Ofrecemos una selección de alimentos premium, formulados con ingredientes de alta calidad para brindar a tu mascota una nutrición equilibrada, fortaleciendo su salud, energía y bienestar en cada etapa de su vida.",
        image: "/image1.png",
        carousel: ["/alim2.png", "/alim1.png", "/alim.png", "/alim3.png"]
    },
    {
        title: "Higiene",
        description: "Mantenemos a tu mascota limpia, fresca y saludable con nuestra amplia gama de productos de higiene. Ofrecemos shampoos especializados, acondicionadores, toallitas húmedas, perfumes, cepillos y más, diseñados para cuidar su piel y pelaje, eliminando suciedad y malos olores.",
        image: "/image2.png",
        carousel: ["/hig3.png", "/hig4.png", "/hig.png", "/hig2.png"]
    },
    {
        title: "Medicamentos",
        description: "Cuidamos la salud de tu mascota con nuestra selección de medicamentos confiables y efectivos. Contamos con antiparasitarios, antibióticos, antiinflamatorios, vitaminas y tratamientos especializados para distintas afecciones.  ",
        image: "/image3.png",
        carousel: ["/medic1.png", "/medic2.png", "/medic3.png", "/medic0.png"]
    }
];

export default function Productos() {
    return (
        <div className="space-y-6 mt-6  w-full px-[6%]">
            <div className="mx-auto w-full">
                <section className="flex items-center gap-5 py-5 bg-white flex-col sm:flex-row">
                    <Image
                        src="/image product.png"
                        alt="Product"
                        width={500}
                        height={300}
                        className="object-contain rounded-md aspect-square sm:w-[28%] w-full"
                    />
                    <div className="text-left flex flex-col gap-5 flex-1 px-6">
                        <h2 className="sm:text-3xl text-xl font-bold">Nuestros Productos</h2>
                        <p className="text-gray-600 text-justify">
                        Ofrecemos una amplia gama de productos para el bienestar y la salud de tus mascotas. 
                        </p>
                        <p className="text-gray-600">
                         ¡Calidad y bienestar en cada producto, porque tu mascota lo merece.! 
                        </p>
                    </div>
                </section>
                
                <div className="space-y-6 mt-6 w-full mx-auto">
                    {products.map((product, index) => (
                        <div key={index}>
                            <ProductCard
                                title={product.title}
                                description={product.description}
                                image={product.image}
                                alt={`Imagen de ${product.title}`}
                                ctaText="Más información"
                                ctaLink="/service.title"
                            />
                            <Carousel images={product.carousel} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}