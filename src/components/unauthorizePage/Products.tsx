import Image from "next/image";
import ProductosBanner from "./ProductosBanner";
const products = [
  { name: "Alimentos", image: "/veterinaria6.png" },
  { name: "Higiene", image: "/hig1.jpg" },
  { name: "Medicamentos", image: "/medicamentos2.jpg" },
];

export default function Products() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative flex flex-col sm:flex-row gap-5 py-5 bg-white w-full min-h-[300px]">
        <div className="sm:w-1/4 w-full">
          <Image
            src="/productos9.jpg"
            alt="Productos"
            width={150}
            height={150}
            className="object-contain rounded-md aspect-square w-full h-full"
          />
        </div>
        <div className="sm:w-3/4 w-full">
          <ProductosBanner />
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10 bg-white mt-10">
        {products.map((product) => (
          <div 
            key={product.name} 
            className="bg-myPurple-disabled p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-col items-center gap-4"
          >
            <div className="w-full aspect-square relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                quality={100}
                className="rounded-md object-cover" 
              />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-myPink-primary">{product.name}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}
