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
import { phoneNumber, ruc } from "@/lib/schemas"; 
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/client/getClientById";
import FormImgUploader from "@/components/global/FormImgUploader";
import { useTranslations } from "next-intl";

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
  profileImg: z.any().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface EditClientFormProps {
  token: string;
  clientId: string;
}

export default function EditClientForm({ token, clientId }: EditClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter(); 
  const u = useTranslations("ClientForm");
  const b = useTranslations("Button");
  const e= useTranslations("Error");
  const s = useTranslations("Success");
  const p = useTranslations("Placeholder");


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema), 
  });

  const profileImg = watch("profileImg");

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

        if (clientData.image?.originalUrl) {
          setPreviewImage(clientData.image.originalUrl);
        }
      } catch (error:unknown) {
        toast("error", error instanceof Error ? error.message : e("errorLoad", {field: "cliente"}));
        router.push("/dashboard/clients");
      }
    };

    fetchClientData();
  }, [clientId, token, setValue, router]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      const fullName = `${data.name.trim()} ${data.lastname.trim()}`;
      
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", data.email);
      if (data.adress) formData.append("adress", data.adress);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("ruc", data.ruc);

      if (data.profileImg instanceof File) {
        formData.append("profileImg", data.profileImg);
      }
    
      setIsSubmitting(true); 
      
      const response = await updateClient(clientId, formData, token);
      
      if ('error' in response) {
        toast("error", response.error || e("noUpdate"));
      } else {
        toast("success", s("successEdit", {field: "Cliente"})); 
        router.push("/dashboard/clients"); 
      }
    } catch (error:unknown) {
      toast("error", e("noUpdate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{u("edit")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="flex flex-col items-center space-y-4">
          <FormImgUploader
            onChange={(file) => {
              if (file) {
                try {
                  setValue("profileImg", file, { shouldValidate: false });
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } catch (error:unknown) {
                  toast("error", error instanceof Error ? error.message : e("errorLoad", {field: "imagen"}));
                }
              }
            }}
            error={errors.profileImg?.message?.toString()}
            prevClassName="w-48 h-48 rounded-full object-cover"
            prevWidth={192}
            defaultImage={previewImage}
          />
        </div>

        <div>
          <Label>{u("name")}</Label>
          <Input {...register("name")} placeholder={p("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>{u("lastName")}</Label>
          <Input {...register("lastname")} placeholder={p("lastName")} />
          {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
        </div>
        <div>
          <Label>{u("email")}</Label>
          <Input {...register("email")} placeholder={p("exampleEmail")} type="email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label>{u("address")}</Label>
          <Input {...register("adress")} placeholder={p("address")} />
          {errors.adress && <p className="text-red-500">{errors.adress.message}</p>}
        </div>
        <div>
          <Label>{u("phone")}</Label>
          <Input {...register("phoneNumber")} placeholder={p("phone")} />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <Label>{u("ruc")}</Label>
          <Input {...register("ruc")} placeholder={p("ruc")} />
          {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
        </div>
        
        <div className="flex gap-4">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.push("/dashboard/clients")}>
            {isSubmitting ? b("cancel") : b("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? b("saving") : b("save")}
          </Button>
        </div>
      </form>
    </div>
  );
} 