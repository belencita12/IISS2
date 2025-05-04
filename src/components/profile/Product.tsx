"use client"

import { useEffect, useState } from "react"
import { Product } from "@/lib/products/IProducts"
import { getProducts } from "@/lib/products/getProducts"
import { Card } from "@/components/product/ProductCardCliente"
import NotImageNicoPets from "../../../public/NotImageNicoPets.png"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const VeterinaryProducts = ({ token }: { token?: string }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()
  const itemsPerView = 4

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({ page: 1, size: 20 }, token ?? "")
        setAllProducts(res?.data || [])
      } catch (err) {
        console.error("Error al obtener productos", err)
      }
    }

    fetchProducts()
  }, [token])

  // Carrusel automático que avanza de a 1
  useEffect(() => {
    if (allProducts.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % (allProducts.length - itemsPerView + 1)
      )
    }, 3000) // cada 3 segundos

    return () => clearInterval(interval)
  }, [allProducts])

  if (allProducts.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm text-center">
      <h2 className="text-2xl font-bold">Productos Veterinarios</h2>
      <p className="text-gray-600 mt-2">Explora los productos disponibles</p>
      <Button asChild className="mt-2">
        <Link href="/user-profile/product">Ver más</Link>
      </Button>

      <div className="relative overflow-hidden mt-6">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(100 / allProducts.length) * currentIndex}%)`,
            width: `${(allProducts.length * 100) / itemsPerView}%`,
          }}
        >
          {allProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/user-profile/product/${product.id}`)}
              className="cursor-pointer w-[25%] px-2 box-border"
            >
              <Card
                title={product.name}
                description={`${product.price.toLocaleString()} Gs.`}
                image={product.image?.originalUrl ?? NotImageNicoPets.src}
                ctaText="Ver detalles"
                ctaLink={`/user-profile/product/${product.id}`}
                tags={product.tags}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
