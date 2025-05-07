import React from "react"
import { Loader2, User, Mail, Phone, MapPin, Building } from "lucide-react"
import { UseFormRegister, FieldErrors } from "react-hook-form"

interface ProfileUserEditFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  register: UseFormRegister<any>
  errors: FieldErrors
  updateLoading: boolean
  handleCancel: () => void
  userData: any
}

export function ProfileUserEditForm({ 
  handleSubmit, 
  register, 
  errors, 
  updateLoading, 
  handleCancel,
  userData
}: ProfileUserEditFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-4">
        <FormField
          label="Nombre completo"
          icon={<User size={18} className="text-violet-500" />}
          error={errors.fullName?.message}
        >
          <input
            {...register("fullName")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
            placeholder="Tu nombre completo"
            defaultValue={userData?.fullName}
          />
        </FormField>

        <FormField
          label="Email"
          icon={<Mail size={18} className="text-violet-500" />}
          error={errors.email?.message}
        >
          <input
            {...register("email")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
            placeholder="Tu email"
            defaultValue={userData?.email}
          />
        </FormField>

        <FormField
          label="Teléfono"
          icon={<Phone size={18} className="text-violet-500" />}
          error={errors.phoneNumber?.message}
        >
          <input
            {...register("phoneNumber")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
            placeholder="Tu número de teléfono"
            defaultValue={userData?.phoneNumber}
          />
        </FormField>

        <FormField
          label="Dirección"
          icon={<MapPin size={18} className="text-violet-500" />}
          error={errors.adress?.message}
        >
          <input
            {...register("adress")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all duration-200"
            placeholder="Tu dirección"
            defaultValue={userData?.adress}
          />
        </FormField>

        <FormField
          label="RUC"
          icon={<Building size={18} className="text-violet-500" />}
          error={errors.ruc?.message}
        >
          <input
            {...register("ruc")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 cursor-not-allowed"
            disabled
            defaultValue={userData?.ruc}
          />
        </FormField>
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          disabled={updateLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          disabled={updateLoading}
        >
          {updateLoading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </div>
    </form>
  )
}

function FormField({ 
  label, 
  icon, 
  error, 
  children 
}: {
  label: string
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block mb-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
        </div>
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}