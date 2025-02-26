'use client'
import * as React from "react"

import { cn } from "@/lib/utils"

// Mensajes de error por defecto si el "errorMessage" no es especificado en <Input/>
const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
  email: "Por favor, introduce un email válido. Ej: juanperez@gmail.com",
  number: "Por favor, introduce un número válido o un valor rango dentro del rango permitido",
  url: "Por favor, introduce una URL válida. Ej: https://www.google.com",
  password: "Por favor, introduce una contraseña válida",
  date: "Por favor, introduce una fecha válida. Ej: 25/12/2024",
  time: "Por favor, introduce una hora válida. Ej: 14:30",
  tel: "Por favor, introduce un número de teléfono válido",
  file: "Por favor, selecciona un archivo válido.",
  range: "Por favor, selecciona un valor dentro del rango permitido.",
}

// Tipos de input que se validarán en tiempo real (onChange)
const REALTIME_VALIDATION_TYPES = ["email", "password", "text", "url", "tel", "number"]

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { errorMessage?: string }>(
  ({ className, type, errorMessage, onChange, onBlur, ...props }, ref) => {

    const [isValid, setIsValid] = React.useState(true)
    const [isTyping, setIsTyping] = React.useState(false) // Nuevo estado para saber si está escribiendo
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null)

    // Se efectúa la validación correspondiente al type del Input
    const validateInput = (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
      const isValidInput = e.target.checkValidity()
      setIsValid(isValidInput)
      setIsTyping(false)
    }

    // Se maneja el input donde es necesario validación en tiempo real
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      // Si se estableció una lógica para onChange, lo ejecutamos y le pasamos el contexto del evento (e)
      if (onChange) {
        onChange(e)
      }

      if (type && REALTIME_VALIDATION_TYPES.includes(type)) {
        setIsTyping(true)

        // Limpiar timeout anterior si existe
        if (timeoutId) clearTimeout(timeoutId)

        // Crear un nuevo timeout para retrasar la validación
        const newTimeoutId = setTimeout(() => {
          validateInput(e)
        }, 500) // 500ms de delay

        setTimeoutId(newTimeoutId)
      }
    }
    
    // Se maneja el input cuando no es necesario validación en tiempo real. "onBlur"
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {

      // Si se estableció una lógica para onBlur, lo ejecutamos y le pasamos el contexto del evento (e)
      if (onBlur) {
        onBlur(e)
      }
      validateInput(e)
    }

    React.useEffect(() => {
      // Cleanup del timeout cuando el componente se desmonta
      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }, [timeoutId])

    // Se elige el mensaje de error que corresponda al "type"
    const defaultMessage = type ? DEFAULT_ERROR_MESSAGES[type] : ""

    // Si no se especifica un mensaje de error personalizado se usa el predeterminado 
    const finalErrorMessage = errorMessage || defaultMessage

    // Se comprueba si el input del usuario es válido y si el usuario está escribiendo en el input
    const showError = !isValid && !isTyping

    // Zona de descripción que mostrará el mensaje de "errorMessages"
    const errorDescription = (showError && finalErrorMessage) ? <p className="text-red-500 text-sm mt-1">{finalErrorMessage}</p> : null

    // Se establece un estilo que muestre una invalidación
    const errorClass = showError ? "border-red-500" : ""

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
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {errorDescription}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
