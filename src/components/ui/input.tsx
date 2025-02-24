'use client'
import * as React from "react"

import { cn } from "@/lib/utils"

// Mensajes de error por defecto si el "errorMessage" no es especificado
const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
  email: "Por favor, introduce un email válido. Ej: juanperez@gmail.com",
  number: "Por favor, introduce un número válido.",
  url: "Por favor, introduce una URL válida. Ej: https://www.google.com",
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { errorMessage?: string }>(
  ({ className, type, errorMessage, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState(true)

    // Se efectúa la validación que indique "type" mediante "checkValidity()"
    const handleValidation = (e: React.FocusEvent<HTMLInputElement>) => {
      const isValidInput = e.target.checkValidity()
      setIsValid(isValidInput)
    }

    // Se elige el mensaje de error que corresponda al "type"
    const defaultMessage = type ? DEFAULT_ERROR_MESSAGES[type] : ""

    // Si no se especifica un mensaje de error personalizado se usa el predeterminado 
    const finalErrorMessage = errorMessage || defaultMessage

    // Zona de descripción que mostrará el mensaje de "errorMessages"
    const errorDescription = (!isValid && finalErrorMessage) ? <p className="text-red-500 text-sm mt-1">{finalErrorMessage}</p> : null

    // Se establece un estilo que muestre una invalidación
    const errorClass = !isValid ? "border-red-500" : ""

    return (
      <div>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
            errorClass
          )}
          ref={ref}
          onBlur={handleValidation}
          {...props}
        />
        {errorDescription}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
