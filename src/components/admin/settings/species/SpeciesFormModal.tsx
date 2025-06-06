"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/global/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Species } from "@/lib/pets/IPet";
import { registerSpecies } from "@/lib/pets/species/registerSpecies";
import { updateSpecies } from "@/lib/pets/species/updateSpecie";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

type SpeciesFormData = z.infer<typeof schema>;

interface SpeciesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: () => void;
  defaultValues?: Species | null; // si existe => modo edición
}

export default function SpeciesFormModal({
  isOpen,
  onClose,
  token,
  onSuccess,
  defaultValues,
}: SpeciesFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpeciesFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  const t = useTranslations();

  useEffect(() => {
    if (defaultValues) {
      reset({ name: defaultValues.name });
    } else {
      reset({ name: "" });
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: SpeciesFormData) => {
    try {
      if (defaultValues) {
        await updateSpecies(defaultValues.id, data, token);
        toast("success", t("success.successUpdateSpecie"));
      } else {
        await registerSpecies(data, token);
        toast("success", t("success.successRegisterSpecie"));
      }
      onSuccess();
      onClose();
    } catch (error:unknown) {
      if (error instanceof Error ) toast("error", error.message)    
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? t("species.table.titleUpdate") : t("species.table.titleRegister")}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1 py-2">
        <div>
          <Label htmlFor="name">{t("species.form.name")}</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("button.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {defaultValues ? t("button.save") : t("button.add")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
