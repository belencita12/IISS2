"use client";

import { useState } from "react"; 
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { z } from "zod"; 
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { useRouter } from "next/navigation"; 
import { registerClient } from "@/lib/client/registerClient"; 
import { FormClient } from "@/lib/client/IUserProfile"; 

const clientFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  adress: z.string().min(1, "La dirección es obligatoria"),
  phoneNumber: z.string().min(1, "El número de teléfono es obligatorio"),
  ruc: z.string().min(1, "El RUC es obligatorio"),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface RegisterClientFormProps {
  token: string;
}

export default function RegisterClientForm({ token }: RegisterClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema), 
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      adress: "",
      phoneNumber: "",
      ruc: "",
    },
  });
  const onSubmit = async (data: ClientFormValues) => {
    const fullName = `${data.name.trim()} ${data.lastname.trim()}`;
    const clientData: FormClient = {
      fullName,
      email: data.email,
      adress: data.adress,
      phoneNumber: data.phoneNumber,
      ruc: data.ruc,
    };
  
    setIsSubmitting(true); 
    try {
      const response = await registerClient(clientData, token);
      
      if ('error' in response) {
        toast("error", response.error || "No se pudo registrar el cliente");
      } else {
        toast("success", "Cliente registrado con éxito"); 
        router.push("/dashboard/clients"); 
      }
    } catch (error) {
      toast("error", "Hubo un error al registrar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Registro de Cliente</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Nombre</Label>
          <Input {...register("name")} placeholder="Ingrese el nombre del cliente" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Apellido</Label>
          <Input {...register("lastname")} placeholder="Ingrese el apellido del cliente" />
          {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
        </div>
        <div>
          <Label>Correo Electrónico</Label>
          <Input {...register("email")} placeholder="ejemplo@gmail.com" type="email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Dirección</Label>
          <Input {...register("adress")} placeholder="Ingrese la dirección del cliente" />
          {errors.adress && <p className="text-red-500">{errors.adress.message}</p>}
        </div>
        <div>
          <Label>Número de Teléfono</Label>
          <Input {...register("phoneNumber")} placeholder="Ingrese el número de teléfono" />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <Label>RUC</Label>
          <Input {...register("ruc")} placeholder="Ingrese el RUC del cliente" />
          {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clients")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}