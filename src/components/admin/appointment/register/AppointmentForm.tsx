"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/lib/appointment/appointmentSchema";
import {
  AppointmentRegister,
  ServiceType,
} from "@/lib/appointment/IAppointment";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { PetData } from "@/lib/pets/IPet";
import { createAppointment } from "@/lib/appointment/service";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import PetSearch from "./PetSearch";
import PetSelected from "./PetSelected";
import ServiceSelect from "./ServiceSelect";
import ServiceSelected from "./ServiceSelected";
import EmployeeSelect from "./EmployeeSelect";
import EmployeeSelected from "./EmployeeSelected";
import { AvailabilityPicker } from "./AvailabilityPicker";
import { useTranslations } from "next-intl";

type AppointmentFormProps = {
  token: string;
};

export const AppointmentForm = ({ token }: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AppointmentRegister>({
    resolver: zodResolver(appointmentSchema),
  });

  const router = useRouter();

  const a = useTranslations("AppointmentForm");
  const b = useTranslations("Button");
  const e = useTranslations("Error");
  const s = useTranslations("Success");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);
  const totalServiceDuration = selectedServices.reduce(
    (total, s) => total + s.durationMin,
    0
  );
  const selectedDate = watch("designatedDate");
  const formattedDate =
    typeof selectedDate === "string" && selectedDate.trim() !== ""
      ? selectedDate.trim()
      : null;

  const onSubmit = async (data: AppointmentRegister) => {
    setIsSubmitting(true);
    console.log("Data to submit:", data);
    try {
      await createAppointment(token, data);
      toast("success", s("successAppointment"));
      router.push("/dashboard/appointment");
    } catch (error: unknown) {
<<<<<<< HEAD
      const errorMessage = error instanceof Error ? error.message : e("errorRegister", {field: "cita"});
=======
      const errorMessage =
        error instanceof Error ? error.message : "Error al registrar la cita";
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
      toast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectEmployee = (employee: EmployeeData) => {
    if (employee.id) {
      setValue("employeeId", employee.id);
      setSelectedEmployee(employee);
    }
  };
  const handleSelectTime = (time: string) => {
    setValue("designatedTime", time, { shouldValidate: true });
  };

  const handleSelectService = (service: ServiceType) => {
    if (service.id && !selectedServices.find((s) => s.id === service.id)) {
      const updatedServices = [...selectedServices, service];
      setSelectedServices(updatedServices);
      setValue(
        "serviceIds",
        updatedServices.map((s) => s.id),
        { shouldValidate: true }
      );
    }
  };

  const handleSelectPet = (pet: PetData) => {
    if (pet.id) {
      setValue("petId", pet.id);
      setSelectedPet(pet);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full min-h-screen px-6 py-10 md:px-20 lg:px-32 space-y-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 mb-1">{a("selectPet")}</label>
=======
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Mascota
          </label>
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
          <PetSearch token={token} onSelectPet={handleSelectPet} />
          <input type="hidden" {...register("petId")} />
          {errors.petId && (
            <p className="text-red-500 text-sm mt-1">{errors.petId.message}</p>
          )}
          {selectedPet && <PetSelected pet={selectedPet} />}
        </div>

        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 mb-1">{a("selectService")}</label>
=======
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Servicio
          </label>
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
          <ServiceSelect token={token} onSelectService={handleSelectService} />
          <input type="hidden" {...register("serviceIds")} />
          {errors.serviceIds && (
            <p className="text-myPink-focus text-sm mt-1">
              {errors.serviceIds.message}
            </p>
          )}
          {selectedServices.map((service) => (
            <ServiceSelected key={service.id} service={service} />
          ))}
        </div>

        <div className="md:col-span-2">
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 mb-1">{a("selectEmployee")}</label>
          <EmployeeSelect token={token} onSelectEmployee={handleSelectEmployee} />
          <input type="hidden" {...register("employeesId")} />
          {errors.employeesId && <p className="text-red-500 text-sm mt-1">{errors.employeesId.message}</p>}
=======
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Empleado
          </label>
          <EmployeeSelect
            token={token}
            onSelectEmployee={handleSelectEmployee}
          />
          <input type="hidden" {...register("employeeId")} />
          {errors.employeeId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.employeeId.message}
            </p>
          )}
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
          {selectedEmployee && <EmployeeSelected employee={selectedEmployee} />}
        </div>

        <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
          <div className="w-full">
<<<<<<< HEAD
            <label className="block text-sm font-medium text-gray-700">{a("selectDate")}</label>
=======
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
            <input
              type="date"
              {...register("designatedDate")}
              className="w-full border border-gray-300 rounded-md p-2"
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.designatedDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designatedDate.message}
              </p>
            )}

            <div className="w-full mt-4">
              {selectedEmployee && formattedDate && selectedServices && (
                <AvailabilityPicker
                  token={token}
                  employeeId={String(selectedEmployee.id)}
                  date={formattedDate}
                  serviceDuration={totalServiceDuration}
                  onSelectTime={handleSelectTime}
                />
              )}

              {errors.designatedTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.designatedTime.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
<<<<<<< HEAD
        <label className="block text-sm font-medium text-gray-700">{a("details")}</label>
=======
        <label className="block text-sm font-medium text-gray-700">
          Detalles
        </label>
>>>>>>> c5184e1f40969a8fe3771af743fcbe1db6a0a22d
        <textarea
          {...register("details")}
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
        />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          className="bg-white text-black hover:bg-slate-50"
          onClick={() => router.push("/dashboard/appointment")}
          disabled={isSubmitting}
        >
          {b("cancel")}
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={
            !selectedEmployee ||
            !selectedServices ||
            !selectedPet ||
            !formattedDate ||
            isSubmitting
          }
        >
          {isSubmitting ? b("scheduleing") : b("schedule")}
        </Button>
      </div>
    </form>
  );
};
