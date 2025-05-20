"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerEmployee } from "@/lib/employee/registerEmployee";
import { getWorkPosition } from "@/lib/employee/getWorkPosition";
import { validatePhoneNumber } from "@/lib/utils";
import { rucFormatRegExp } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const employeeFormSchema = z.object({
  ruc: z.string().min(1, "El RUC es obligatorio").regex(rucFormatRegExp, "El RUC debe tener el formato 12345678-1"),
  fullName: z.string().min(1, "El nombre completo es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  position: z.string().min(1, "Debe seleccionar un puesto"),
  adress: z.string().optional(),
  phoneNumber: z.string().min(1, "El número de teléfono es obligatorio").refine(validatePhoneNumber, {
    message: "Número de teléfono inválido. Debe comenzar con + y tener al menos 7 dígitos.",
  }),
  profileImg: z.instanceof(File).optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  token: string;
}

export default function EmployeeForm({ token }: EmployeeFormProps) {
  const [positions, setPositions] = useState<{ id: number; name: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const e = useTranslations("EmployeeTable");
  const b = useTranslations("Button");
  const ph= useTranslations("Placeholder");
  const s = useTranslations("Success");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      ruc: "",
      fullName: "",
      email: "",
      position: "",
      adress: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (!token) return;
    const fetchPositions = async () => {
      try {
        const data = await getWorkPosition(token);
        if (Array.isArray(data)) {
          setPositions(data);
        } else {
        }
      } catch (error : unknown) {
        if (error instanceof Error) {
          toast("error", error.message)};
      }
    };
    fetchPositions();
  }, [token]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewImage(null);
    const file = event.target.files?.[0];
    if (!file) {
      setValue("profileImg", undefined);
      return;
    }
    setValue("profileImg", file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    const formData = new FormData();
    Object.entries({
      ruc: data.ruc,
      fullName: data.fullName,
      email: data.email,
      positionId: data.position,
      adress: data.adress,
      phoneNumber: data.phoneNumber,
    }).forEach(([key, value]) => formData.append(key, value ?? ""));

    if (data.profileImg) {
      formData.append("profileImg", data.profileImg);
    }

    setIsSubmitting(true);
    try {
      await registerEmployee(formData, token);
      toast("success", s("successRegister", {field: "Empleado"}));
      router.push("/dashboard/employee");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errorMessage = (error as { message: string }).message;
        toast("error", errorMessage);
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{e("titleRegister")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>{e("ruc")}</Label>
          <Input {...register("ruc")} placeholder={ph("ruc")} />
          {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
        </div>
        <div>
          <Label>{e("name")}</Label>
          <Input {...register("fullName")} placeholder={ph("name")} />
          {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label>{e("email")}</Label>
          <Input {...register("email")} placeholder={ph("email")} type="email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label>{e("position")}</Label>
          <Select
            onValueChange={(value) => {
              setValue("position", value);
              trigger("position");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={ph("select")} />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.id.toString()}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.position && <p className="text-red-500">{errors.position.message}</p>}
        </div>
        <div>
          <Label>{e("address")}</Label>
          <Input {...register("adress")} placeholder={ph("address")} />
          {errors.adress && <p className="text-red-500">{errors.adress.message}</p>}
        </div>
        <div>
          <Label>{e("phone")}</Label>
          <Input {...register("phoneNumber")} placeholder={ph("phone")}/>
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <Label>{e("image")}</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <Image src={previewImage} alt="Vista previa" width={96} height={96} className="mt-4 w-24 h-24 rounded-full" />
          )}
          {errors.profileImg && <p className="text-red-500">{errors.profileImg.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline"  disabled={isSubmitting} onClick={() => router.push("/dashboard/employee")}>
            {b("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? b("registering") : b("register")}
          </Button>
        </div>
      </form>
    </div>
  );
}
