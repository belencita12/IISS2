"use client"; // Asegura que el componente se ejecute en el cliente

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/admin/products/IProducts";
import { getProductById } from "@/lib/admin/products/getProductById";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";


interface ProductDetailProps {
  token: string;
}

const branches = [
  { name: "El Arca 2 Pet Shop", address: "Gral. Cabañas (Avda. Irrazábal)" },
  { name: "Mundo Animal", address: "Boulevard Central (Avda. Central)" },
  { name: "Pets & Friends", address: "Calle 123 (Zona Rosa)" },
  { name: "Zoo Market", address: "Avenida del Parque (Zona Norte)" },
  { name: "Mascota Feliz", address: "Ruta 5 (Zona Sur)" },
];

export default function ProductDetail({ token }: ProductDetailProps) {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Generar stock solo una vez
  const [simulatedStock] = useState(() => Math.floor(Math.random() * 300) + 1);

  useEffect(() => {
    if (!id || id === "create") return;
    
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProductById(id as string, token);
        setProduct(data);
      } catch (err) {
        console.error("Error al obtener detalle del producto:", err);
        setError("No se pudo cargar el producto.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id, token]);

  // Distribuir stock solo una vez
  const stockByBranch = useMemo(
    () => distributeStock(simulatedStock, branches.length),
    [simulatedStock]
  );

  function distributeStock(totalStock: number, numBranches: number): number[] {
    let remainingStock = totalStock;
    const stockDistribution = Array(numBranches).fill(0);
    for (let i = 0; i < numBranches - 1; i++) {
      const allocation =
        Math.floor(Math.random() * (remainingStock / (numBranches - i))) + 1;
      stockDistribution[i] = allocation;
      remainingStock -= allocation;
    }
    stockDistribution[numBranches - 1] = remainingStock;
    return stockDistribution;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isLoading ? (
        <div className="text-center mt-8">Cargando...</div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">{error}</div>
      ) : !product ? (
        <div className="text-center mt-8">No se encontró el producto.</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
              {product.image?.originalUrl ? (
                <Image
                  src={product.image.originalUrl}
                  alt={product.name}
                  width={260}
                  height={260}
                  className="object-contain"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-4xl font-bold">
                  {product.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Columna de información */}
            <div className="w-full md:w-2/3 md:pl-6 self-start mt-3">
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              
              <div className="space-y-2">
              <div className="flex">
                  <span className="text-gray-600 w-24">Código:</span>
                  <span className="flex-grow text-right">{product.code?.toLocaleString()}</span>
                </div>

                <div className="flex">
                  <span className="text-gray-600 w-24">Precio:</span>
                  <span className="flex-grow text-right">{product.price?.toLocaleString()} Gs</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-600 w-24">Costo:</span>
                  <span className="flex-grow text-right">{product.cost?.toLocaleString()} Gs</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-600 w-24">Stock:</span>
                  <span className="flex-grow text-right">{simulatedStock}</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-600 w-24">Categoría:</span>
                  <span className="flex-grow text-right">{product.category}</span>
                </div>
              </div>
              
              {/* Botones */}
              <div className="flex gap-4 mt-6 justify-center">
                <Button
                  variant="default"
                  onClick={() => router.push(`/dashboard/products/delete/id`)}
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2"
                >
                  Eliminar
                </Button>
                <Button
                  variant="default"
                  onClick={() => router.push("/dashboard/products/update")}
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2"
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
  
          {/* Sección de sucursales */}
          <div className="mt-10 w-full">
            <h3 className="text-2xl font-semibold text-center mb-6">
              Cantidad por Sucursales
            </h3>
            
            <div className="w-full mx-auto">
              {branches.map((branch, index) => (
                <Card
                  key={branch.name}
                  className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex p-3 justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold">{branch.name}</h3>
                      <p className="text-sm text-gray-500">{branch.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {stockByBranch[index]} Unids.
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}