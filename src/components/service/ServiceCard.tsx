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
    <div className="flex w-full flex-wrap md:flex-nowrap rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Imagen en la parte izq */}
      <div className="w-full md:w-[30%] flex-shrink-0">
        <Image
          src={image || "/placeholder.svg?height=400&width=400"}
          alt={alt}
          width={400}
          height={400}
          className="w-full h-full object-cover aspect-square"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="bg-gray-50 p-6 flex flex-col justify-between w-full md:w-[70%]">
        <div className="text-left flex flex-col gap-2 flex-1">
          <h3 className="text-xl font-semibold text-myPurple-primary">{title}</h3>
          <p className="mt-2 text-gray-600 text-sm md:text-base">{description}</p>
        </div>
        <div className="flex w-full justify-end mt-4">
          {/* Botón de llamada a la acción */}
          <Button className="bg-myPurple-primary hover:bg-myPurple-hover">
            <a href={ctaLink} className="inline-block text-white">
              {ctaText}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
