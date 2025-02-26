const products = [
  { name: "Alimentos", image: "/image1.png" },
  { name: "Higiene", image: "/image2.png" },
  { name: "Medicamentos", image: "/image3.png" },
];

export default function Products() {
  return (
    <div>
      <section className="flex items-center py-10 bg-white gap-5">
        <img
          src="/image product.png"
          alt="Productos"
          width={150}
          height={150}
          className="object-contain rounded-md"
        />
        <div className="text-left mr-8">
          <h2 className="text-3xl font-bold mb-4">Nuestros productos</h2>
          <p className="text-gray-600 mb-6">
            Nuestros productos.
          </p>
        </div>
      </section>
      <section className="flex sm:flex-row flex-col items-center justify-between py-10 bg-white gap-4">
        {products.map((product) => (
          <div key={product.name} className="bg-white p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-row sm:flex-col items-center gap-4">
            <img src={product.image} alt={product.name} className="rounded-md sm:max-w-full max-w-[30%] aspect-square" />
            <h3 className="font-semibold">{product.name}</h3>
          </div>
        ))}
      </section>
    </div>

  );
}
