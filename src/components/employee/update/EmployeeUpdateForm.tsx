"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getEmployeeByID } from "@/lib/employee/getEmployeeByID";
import { useUpdateEmployee } from "@/lib/employee/updateEmployee";
import { toast } from "@/lib/toast";
import { getWorkPosition } from "@/lib/employee/getWorkPosition";
import { EmployeeData } from "@/lib/employee/IEmployee";
import FormSelect, { SelectOptions } from "@/components/global/FormSelect";

const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const employeeFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  address: z.string().min(1, "La dirección es obligatoria"),
  ruc: z.string().regex(/^\d{6,8}-\d$/, "El RUC debe tener de 6 a 8 dígitos, un guion y un dígito verificador"),
  positionId: z.string().min(1, "Selecciona un puesto"),
  phoneNumber: z.string()
    .regex(/^\+595\d{9}$/, "El teléfono debe iniciar con +595 y tener 9 dígitos"),
  profileImage: z
    .instanceof(File)
    .refine(
      (file) =>
        ALLOWED_IMAGE_TYPES.includes(file.type) &&
        file.size <= MAX_FILE_SIZE,
      "Imagen inválida o muy grande"
    )
    .optional()
    .or(z.literal("")),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface Props {
  token: string;
  employeeId: number;
}

interface Position {
  id: number;
  name: string;
}

export default function EmployeeUpdateForm({ token, employeeId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      ruc: "",
      positionId: "",
      phoneNumber: "",
      profileImage: undefined,
    },
  });

  // Hook para actualizar empleado
  const { updateEmployee } = useUpdateEmployee(token);

  // Cargar datos del empleado
  useEffect(() => {
    setIsLoading(true);
    getEmployeeByID(token, employeeId)
      .then((data) => {
        setEmployee(data);
        setValue("name", data.fullName || "");
        setValue("email", data.email || "");
        setValue("address", data.adress || "");
        setValue("ruc", data.ruc || "");
        setValue("positionId", data.position?.id?.toString() || "");
        setValue("phoneNumber", data.phoneNumber || "");
        if (data.image?.previewUrl) setPreviewImage(data.image?.originalUrl || null);
      })
      .catch(() => toast("error", "No se pudo cargar el empleado"))
      .finally(() => setIsLoading(false));
  }, [employeeId, token, setValue]);

  // Cargar todos los puestos de trabajo
  useEffect(() => {
    setPositionsLoading(true);
    getWorkPosition(token)
      .then((data) => setPositions(data))
      .catch(() => toast("error", "No se pudieron cargar los puestos"))
      .finally(() => setPositionsLoading(false));
  }, [token]);

  // Imagen de perfil
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewImage(null);
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file as File, { shouldValidate: true });
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
        setValue("profileImage", "" as unknown as File, { shouldValidate: true });
        setPreviewImage(null);
    }
  };

  // Generar las opciones para FormSelect
  const positionOptions: SelectOptions[] = positions.map((pos) => ({
    value: String(pos.id),
    label: pos.name,
  }));

  // Enviar formulario
  const onSubmit = async (data: EmployeeFormValues) => {
    const formData = new FormData();
    formData.append("fullName", data.name);
    formData.append("email", data.email);
    formData.append("adress", data.address);
    formData.append("ruc", data.ruc);
    formData.append("positionId", String(Number(data.positionId)));
    formData.append("phoneNumber", data.phoneNumber);
    if (data.profileImage && data.profileImage instanceof File) {
      formData.append("profileImg", data.profileImage);
    }

    // DEBUG: Mostrar los datos enviados
    for (const pair of formData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    try {
      await updateEmployee(employeeId, formData);
      toast("success", "Empleado actualizado correctamente");
      router.push(`/dashboard/employee/${employeeId}`);
    } catch (e) {
      toast("error", "Error al actualizar el empleado");
    }
  };

  // Solo renderizar el formulario cuando todo esté listo
  const ready =
    !isLoading &&
    !positionsLoading &&
    employee &&
    positions.length > 0 &&
    !!employee.position?.id;

  return (
    <div className="mx-auto p-4" style={{ maxWidth: "70vw" }}>
      <h1 className="text-3xl font-bold mb-6">Actualizar Empleado</h1>
      {!ready ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col items-center w-full">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Imagen de perfil"
                width={200}
                height={200}
                className="rounded-full mb-2"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleImageChange} className=" hover:bg-gray-200 cursor-pointer"/>
            {errors.profileImage && (
              <p className="text-red-500">{errors.profileImage.message as string}</p>
            )}
          </div>

          <div className="w-full">
            <FormSelect
              label="Puesto"
              name="positionId"
              id="positionId"
              options={positionOptions}
              placeholder="Selecciona un puesto"
              error={errors.positionId?.message}
              onChange={(value) => setValue("positionId", value)}
              register={register("positionId")}
              disabled={positions.length === 0}
            />
          </div>
          <div className="w-full">
            <Label>Nombre</Label>
            <Input {...register("name")} placeholder="Nombre completo" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div className="w-full">
            <Label>Email</Label>
            <Input {...register("email")} placeholder="Correo electrónico" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="w-full">
            <Label>RUC</Label>
            <Input {...register("ruc")} placeholder="Ej: 12345678-0" />
            {errors.ruc && <p className="text-red-500">{errors.ruc.message}</p>}
          </div>
          <div className="w-full">
            <Label>Dirección</Label>
            <Input {...register("address")} placeholder="Dirección" />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>
          <div className="w-full">
            <Label>Teléfono</Label>
            <Input {...register("phoneNumber")} placeholder="Teléfono" />
            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
          </div>
          {/* Botones */}
          <div className="w-full flex justify-start gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/employee")}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Actualizar empleado
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}