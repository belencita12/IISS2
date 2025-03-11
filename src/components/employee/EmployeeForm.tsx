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
      className=" mx-auto flex gap-x-20 p-8 bg-white rounded-lg shadow-md"
    >
      {/* 📌 Sección Izquierda (RUC, Nombre, Apellido, Correo y Puesto) */}
      <div className="flex-1 space-y-6">
        <div>
          <Label>RUC</Label>
          <Input placeholder="Ingrese su RUC..." className="w-full" {...register("ruc", { required: "Campo obligatorio" })} />
          {typeof errors.ruc?.message === "string" && (
            <p className="text-red-500">{errors.ruc.message}</p>
          )}
        </div>

        <div>
          <Label>Nombre</Label>
          <Input placeholder="Ingrese su nombre..." {...register("nombre", { required: "Campo obligatorio" })} />
          {typeof errors.nombre?.message === "string" && (
            <p className="text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <Label>Apellido</Label>
          <Input placeholder="Ingrese su apellido..." {...register("apellido")} />
        </div>

        <div>
          <Label>Correo</Label>
          <Input type="email" placeholder="Ingrese su correo..." {...register("correo", { required: "Campo obligatorio" })} />
          {typeof errors.correo?.message === "string" && (
            <p className="text-red-500">{errors.correo.message}</p>
          )}
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

      {/* 📌 Sección Derecha (Disponibilidad, Token, Foto) */}
      <div className="flex-1 space-y-7">
        <div>
          <Label>Establecer disponibilidad</Label>
          <div className="grid grid-cols-2 gap-2">
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
          <div className="border border-dashed p-4 flex flex-col items-center justify-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer">
              {file ? file.name : "Arrastra una imagen aquí"}
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">Agregar</Button>
      </div>
    </form>
  );
}

export default EmployeeForm;
