import Image from "next/image"
import { Button } from "@/components/ui/button"

interface IServiceCardProps {
  title: string
  description: string
  image: string
  alt: string
  ctaText: string
  ctaLink: string
}

export function ServiceCard({ title, description, image, alt, ctaText, ctaLink }: IServiceCardProps) {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap rounded-lg overflow-hidden shadow-md">
      {/* Imagen en la parte izq */}
      <div className="w-full md:w-[30%] flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={alt}
          width={400}
          height={400}
          className="w-full h-auto object-cover aspect-square"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="bg-gray-100 p-[3%] flex flex-col justify-between w-full md:w-[70%]">
        <div className="text-left flex flex-col gap-1 flex-1">
          <h3 className="text-xl font-semibold text-[#a855f7]">{title}</h3>
          <p className="mt-2 text-gray-600 text-justify text-xs xl:text-lg lg:text-base">{description}</p>
        </div>
        <div className="flex w-full justify-end">
          {/* Botón de llamada a la acción */}
          <div className="mt-4">
            <Button className="bg-[#a855f7] hover:bg-[#9333ea]">
              <a href={ctaLink} className="inline-block text-white px-4 py-2 rounded transition">
                {ctaText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
