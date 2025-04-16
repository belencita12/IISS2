"use client";

import { useState, useEffect } from "react"; 
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { z } from "zod"; 
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { useRouter } from "next/navigation"; 
import { updateClient } from "@/lib/client/updateClient"; 
import { FormClient } from "@/lib/client/IUserProfile"; 
import { phoneNumber, ruc } from "@/lib/schemas"; 
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/client/getClientById";

const clientFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio") 
    .email("El formato del correo electrónico no es válido"),
  adress: z.string().optional(),
  phoneNumber: phoneNumber(),
  ruc: ruc(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface EditClientFormProps {
  token: string;
  clientId: string;
}

export default function EditClientForm({ token, clientId }: EditClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema), 
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData = await getClientById(Number(clientId), token);
        
        if (!clientData) {
          notFound();
        }
        
        // Dividir el nombre completo en nombre y apellido
        const [name, ...lastnameParts] = clientData.fullName.split(' ');
        const lastname = lastnameParts.join(' ');
        
        setValue('name', name);
        setValue('lastname', lastname);
        setValue('email', clientData.email);
        setValue('adress', clientData.adress);
        setValue('phoneNumber', clientData.phoneNumber);
        setValue('ruc', clientData.ruc);
      } catch (error) {
        toast("error", "Error al cargar los datos del cliente");
        router.push("/dashboard/clients");
      }
    };

    fetchClientData();
  }, [clientId, token, setValue, router]);

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
      const response = await updateClient(clientId, clientData, token);
      
      if ('error' in response) {
        toast("error", response.error || "No se pudo guardar los cambios del cliente");
      } else {
        toast("success", "Cliente actualizado con éxito"); 
        router.push("/dashboard/clients"); 
      }
    } catch (error) {
      toast("error", "Hubo un error al actualizar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Editar Cliente</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clients")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
} 