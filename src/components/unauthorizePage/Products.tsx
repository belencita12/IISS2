import Image from "next/image";
const products = [
  { name: "Alimentos", image: "/image1.png" },
  { name: "Higiene", image: "/image2.png" },
  { name: "Medicamentos", image: "/image3.png" },
];

export default function Products() {
  return (
    <div>
      <section className="flex items-center py-5 bg-white gap-5">
        <Image
          src="/image product.png"
          alt="Productos"
          width={150}
          height={150}
          className="object-contain rounded-md aspect-square sm:w-[25%] w-[40%]"
        />
        <div className="text-left flex flex-col gap-5 flex-1">
          <h2 className="sm:text-3xl text-xl font-bold mb-4">Nuestros productos</h2>
          <p className="text-gray-600 ">
            Nuestros productos.
          </p>
        </div>
      </section>
      <section className="flex sm:flex-row flex-col items-center justify-between w-full py-10 bg-white gap-4">
        {products.map((product) => (
          <div key={product.name} className="flex-1 w-full bg-white p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-row sm:flex-col items-center gap-4">
            <Image 
            src={product.image} 
            alt={product.name} 
            width={150}
            height={150}
            className="h-auto rounded-md sm:w-[90%] w-[30%] aspect-square" />
            <h3 className="font-semibold">{product.name}</h3>
          </div>
        ))}
      </section>
    </div>

  );
}
