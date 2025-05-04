"use client"

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Product } from "@/lib/products/IProducts"
import { getProducts } from "@/lib/products/getProducts"
import { Card } from "@/components/product/ProductCardCliente"
import NotImageNicoPets from "../../../public/NotImageNicoPets.png"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const VeterinaryProducts = ({ token }: { token?: string }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: 1 })
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProducts({ page: 1, size: 20 }, token ?? "")
      setProducts(res?.data || [])
    }
    fetchProducts()
  }, [token])

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [emblaApi])

  if (products.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm text-center">
      <h2 className="text-2xl font-bold">Productos Veterinarios</h2>
      <p className="text-gray-600 mt-2">Explora los productos disponibles</p>
      <Button asChild className="mt-2">
        <Link href="/user-profile/product">Ver más</Link>
      </Button>

      <div className="overflow-hidden mt-6" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_25%] px-2 cursor-pointer"
              onClick={() => router.push(`/user-profile/product/${product.id}`)}
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
