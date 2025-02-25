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
            Siguiente productos.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-between py-10 bg-white">
        {products.map((product) => (
          <div key={product.name} className="bg-white p-4 rounded-lg shadow-lg text-center transition-all duration-200 hover:scale-105 cursor-pointer">
            <img src={product.image} alt={product.name} className="rounded-md mb-4" />
            <h3 className="font-semibold">{product.name}</h3>
          </div>
        ))}
      </section>
    </div>

  );
}
