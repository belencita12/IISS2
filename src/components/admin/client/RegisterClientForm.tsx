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
import { phoneNumber, ruc } from "@/lib/schemas"; 
import { useTranslations } from "next-intl";

const clientFormSchema = z.object({
  
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio") 
    .email("El formato del correo electrónico no es válido"),
  adress: z.string().optional(),
  phoneNumber: phoneNumber(), //validación reutilizable
  ruc: ruc(), //validación reutilizable
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface RegisterClientFormProps {
  token: string;
}

export default function RegisterClientForm({ token }: RegisterClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); 
  const t = useTranslations();

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

      toast("success", t("success.successRegisterClient")); 
      router.push("/dashboard/clients"); 

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast("error", error.message);
      } else {
        toast("error", t("error.errorRegisterClient"));
      }
    } finally {
      setIsSubmitting(false);
    }}

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t("client.form.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <Label>{t("client.form.name")}</Label>
          <Input {...register("name")} placeholder={t("placeholder.name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>{t("client.form.lastName")}</Label>
          <Input {...register("lastname")} placeholder={t("placeholder.lastName")} />
          {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
        </div>
        <div>
          <Label>{t("client.form.email")}</Label>
          <Input {...register("email")} placeholder={t("placeholder.exampleEmail")} type="email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label>{t("client.form.address")}</Label>
          <Input {...register("adress")} placeholder={t("placeholder.address")} />
          {errors.adress && <p className="text-red-500">{errors.adress.message}</p>}
        </div>
        <div>
          <Label>{t("client.form.phone")}</Label>
          <Input {...register("phoneNumber")} placeholder={t("placeholder.phone")} />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <Label>{t("client.form.ruc")}</Label>
          <Input {...register("ruc")} placeholder={t("placeholder.ruc")} />
          {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clients")}>
            {t("button.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("button.registering") : t("button.register")}
          </Button>
        </div>
      </form>
    </div>
  );
}