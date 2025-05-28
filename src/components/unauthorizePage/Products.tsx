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
      <section className="relative flex flex-col sm:flex-row gap-5 py-5 bg-white w-full">
        <div className="sm:w-1/4 w-full sticky top-0">
          <Image
            src="/productos9.jpg"
            alt="Productos"
            width={150}
            height={150}
            className="object-contain rounded-md aspect-square w-full h-full"
          />
        </div>
        <div className="sm:w-3/4 w-full relative">
          <div className="absolute inset-0">
            <ProductosBanner />
          </div>
        </div>
      </section>
      <section className="flex sm:flex-row flex-col items-center justify-between w-full py-10 bg-white gap-4">
        {products.map((product) => (
          <div 
            key={product.name} 
            className="flex-1 w-full bg-myPurple-disabled p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-row sm:flex-col items-center gap-4"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              width={300}
              height={300}
              quality={100}
              className="h-auto rounded-md sm:w-[90%] w-[30%] aspect-square object-cover" 
            />
            <h3 className="font-semibold text-myPink-primary">{product.name}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}
