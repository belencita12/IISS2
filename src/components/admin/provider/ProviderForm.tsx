"use client";

import { Provider } from "@/lib/provider/IProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useState } from "react";
import { updateProvider } from "@/lib/provider/updateProvider";
import { createProvider } from "@/lib/provider/createProvider";
import { useProviderForm, ProviderFormValues } from "@/hooks/provider/useProviderForm";
import { useTranslations } from "next-intl";


interface Props {
  token: string;
  initialData?: Provider; // Si viene, estamos editando
}

export default function ProviderForm({ token, initialData }: Props) {
  const router = useRouter();
  const t = useTranslations();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useProviderForm(initialData);
  

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await updateProvider(token, initialData.id, data);
        toast("success", t("success.successUpdateProvider"));
      } else {
        await createProvider(token, data);
        toast("success", t("success.successRegisterProvider"));
      }
      router.push("/dashboard/settings/providers");
    } catch (err) {
      if (err instanceof Error) {
        toast("error", err.message);
      }
      else{
        toast("error", t("error.errorSaveProvider"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? t("providers.form.titleUpdate") : t("providers.form.titleRegister")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">{t("providers.form.name")}</label>
          <Input {...register("businessName")} placeholder={t("placeholder.businessNameExample")}/>
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("providers.form.description")}</label>
          <Input {...register("description")} placeholder={t("placeholder.description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("providers.form.phone")}</label>
          <Input {...register("phoneNumber")} placeholder={t("placeholder.phone")} />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">{t("providers.form.ruc")}</label>
          <Input {...register("ruc")} placeholder={t("placeholder.ruc")} />
          {errors.ruc && <p className="text-red-500 text-sm">{errors.ruc.message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" disabled={isSubmitting} variant="outline" onClick={() => router.push("/dashboard/settings/providers")}>
            {t("button.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEdit ? t("button.saving") : t("button.adding")) : isEdit ? t("button.save") : t("button.add")}
          </Button>
        </div>
      </form>
    </div>
  );
}
