"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/admin/products/IProducts";
import { getProductById } from "@/lib/admin/products/getProductById";
import { getStockDetails } from "@/lib/stock/getStockDetails";
import { getStocks } from "@/lib/stock/getStock"; // IMPORTAR
import { StockDetailsData, StockData } from "@/lib/stock/IStock"; // IMPORTAR
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ProductDetailProps {
  token: string;
}

export default function ProductDetail({ token }: ProductDetailProps) {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [stockDetails, setStockDetails] = useState<StockDetailsData[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]); // Estado para las sucursales reales

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Cargar producto
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

  // 2) Cargar detalles de stock del producto
  useEffect(() => {
    if (!product) return;

    async function fetchStockDetails() {
      try {
        const response = await getStockDetails(product!.id, token);
        setStockDetails(response.data);
      } catch (err) {
        console.error("Error al obtener stock del producto:", err);
      }
    }
    fetchStockDetails();
  }, [product, token]);

  // 3) Cargar sucursales (stocks) reales
  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await getStocks({ page: 1, size: 100 }, token);
        setStocks(response.data);
      } catch (err) {
        console.error("Error al obtener la lista de sucursales:", err);
      }
    }
    fetchStocks();
  }, [token]);

  if (isLoading) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-8">No se encontró el producto.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Encabezado con imagen e información básica */}
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
              <span className="flex-grow text-right">{product.code}</span>
            </div>

            <div className="flex">
              <span className="text-gray-600 w-24">Precio:</span>
              <span className="flex-grow text-right">
                {product.price?.toLocaleString()} Gs
              </span>
            </div>

            <div className="flex">
              <span className="text-gray-600 w-24">Costo:</span>
              <span className="flex-grow text-right">
                {product.cost?.toLocaleString()} Gs
              </span>
            </div>

            <div className="flex">
              <span className="text-gray-600 w-24">Stock:</span>
              <span className="flex-grow text-right">
                {stockDetails.reduce((acc, detail) => acc + detail.amount, 0)}
              </span>
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
              onClick={() => router.push(`/dashboard/products`)}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2"
            >
              Eliminar
            </Button>
            <Button
              variant="default"
              onClick={() =>
                router.push(`/dashboard/products/update/${product.id}`)
              }
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
          {(stocks.length === 0 || stockDetails.length === 0) ? (
            <div className="text-center py-4">Cargando stock...</div>
          ) : (
            stockDetails.map((detail, index) => {
              const matchedStock = stocks.find((s) => s.id === detail.stockId);
              if (!matchedStock) return null;
              return (
                <Card
                  key={`${matchedStock.id}-${index}`}
                  className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex p-3 justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold">
                        {matchedStock.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {matchedStock.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {detail.amount} Unids.
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
