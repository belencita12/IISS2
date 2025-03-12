"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

function EmployeeForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const onSubmit = (data: any) => console.log(data);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:flex-row flex-wrap gap-8 p-6 rounded-lg max-w-full mx-auto"
    >
      {/* 📌 Sección Izquierda */}
      <div className="flex-auto space-y-4 w-full md:w-1/2 p-4">
        <div>
          <Label>RUC</Label>
          <Input placeholder="Ingrese su RUC..."  {...register("ruc", { required: "Campo obligatorio" })} />
          {typeof errors.ruc?.message === "string" && (
            <p className="text-red-500">{errors.ruc.message}</p>
          )}
        </div>

        <div>
          <Label>Nombre</Label>
          <Input placeholder="Ingrese su nombre..." {...register("nombre", { required: "Campo obligatorio" })} />
          {typeof errors.nombre?.message === "string" && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        <div>
          <Label>Apellido</Label>
          <Input placeholder="Ingrese su apellido..." {...register("apellido", { required: "Campo obligatorio" })} />
          {typeof errors.apellido?.message === "string" && <p className="text-red-500">{errors.apellido.message}</p>}
        </div>

        <div>
          <Label>Correo</Label>
          <Input type="email" placeholder="Ingrese su correo..." {...register("correo", { required: "Campo obligatorio" })} />
          {typeof errors.correo?.message === "string" && <p className="text-red-500">{errors.correo.message}</p>}
        </div>

        <div>
          <Label>Puesto</Label>
          <Select onValueChange={(value) => setValue("puesto", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el puesto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="recepcionista">Recepcionista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 📌 Sección Derecha */}
      <div className="flex-auto space-y-7 w-full md:w-1/3 p-4">
        <div className="flex-auto space-y-4">
          <Label>Establecer disponibilidad</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-3">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((dia) => (
              <div key={dia} className="flex items-center space-x-2">
                <Checkbox {...register(`disponibilidad.${dia}`)} />
                <Label>{dia}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Token de Calendly</Label>
          <Input placeholder="Ingrese el token..." {...register("tokenCalendly")} />
          <a href="#" className="text-blue-600 text-sm">Consíguelo Aquí</a>
        </div>

        <div>
          <Label>Foto del empleado</Label>
          <div className="border border-dashed p-4 flex flex-col w-full items-center justify-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer">
              {file ? file.name : "Arrastra una imagen aquí"}
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto p-4 justify-end ml-auto">
        <Button type="button" variant="outline" className="text-black border-gray-300 hover:bg-gray-100">
          Cancelar
        </Button>
        <Button type="submit" variant="default" className="bg-black text-white hover:bg-gray-900">
          Registrar
        </Button>
      </div>
    </form>
  );
}

export default EmployeeForm;
