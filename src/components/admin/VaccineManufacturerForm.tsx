'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/lib/toast'

// Esquema de validación solo con nombre
const manufacturerSchema = z.object({
  name: z.string().min(1, 'El nombre del fabricante es obligatorio.'),
})

type ManufacturerFormValues = z.infer<typeof manufacturerSchema>

interface ManufacturerFormProps {
  mode: 'create' | 'edit'
  initialData?: ManufacturerFormValues
  onSubmitHandler: (data: ManufacturerFormValues) => Promise<void>
}

export default function ManufacturerForm({
  mode,
  initialData,
  onSubmitHandler,
}: ManufacturerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManufacturerFormValues>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: initialData || {
      name: '',
    },
  })

  const onSubmit = async (data: ManufacturerFormValues) => {
    setIsSubmitting(true)
    try {
      //await onSubmitHandler(data)
      toast('success', `Fabricante ${mode === 'create' ? 'creado' : 'actualizado'} exitosamente.`)
      router.push('/admin/fabricantes') // Ruta de lista de fabricantes
    } catch (error) {
      console.error(error)
      toast('error', 'Ocurrió un error al procesar la solicitud.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Agregar' : 'Editar'} Fabricante de Vacunas</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo nombre */}
        <div>
          <Label htmlFor="name">Nombre del Fabricante</Label>
          <Input
            id="name"
            placeholder="Ej. Pfizer, Moderna, AstraZeneca"
            {...register('name')}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-start gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/fabricantes')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (mode === 'create' ? 'Agregando...' : 'Actualizando...') : (mode === 'create' ? 'Agregar Fabricante' : 'Actualizar Fabricante')}
          </Button>
        </div>
      </form>
    </div>
  )
}
