import FormInput from "@/components/global/FormInput";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import { Tag } from "@/lib/tags/types";
import { toast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {useFetch} from "@/hooks/api/useFetch";
import { TAG_API } from "@/lib/urls";
import { useTranslations } from "next-intl";

type TagFormProps = {
  init?: Pick<Tag, "id" | "name">;
  token: string;
  isOpen: boolean;
  onClose: () => void;
  afterSubmit?: (tag: Tag) => void;
};

const TagForm = ({
  init,
  isOpen,
  token,
  onClose,
  afterSubmit,
}: TagFormProps) => {
  const tagSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
  });

  type TagForm = z.infer<typeof tagSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<TagForm>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    reset(init || { name: "" });
  }, [init, isOpen, reset]);

  // Hook personalizado para crear/editar etiquetas
  const {
    post: createTag,
    patch: updateTag,
    loading,
  } = useFetch<Tag, { name: string }>(
    init ? `${TAG_API}/${init.id}` : `${TAG_API}`,
    token,
    {
      method: init ? "PATCH" : "POST",
    }
  );

  const t = useTranslations();

  if (!isOpen) return null;

  const onSubmit = async (data: TagForm) => {
    const response = init
      ? await updateTag(data)
      : await createTag(data);

    if (response.ok && response.data) {
      toast("success", init ?  t("success.successUpdateTag") : t("success.successRegisterTag"));
      afterSubmit?.(response.data);
      reset();
      onClose();
    } else {
      toast("error", t("error.errorSaveTag"));
    }
  };

  return (
    <Modal
      title={init ? t("tags.form.titleUpdate") : t("tags.form.titleRegister")}
      isOpen={isOpen || loading}
      onClose={onClose}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          register={register("name")}
          error={errors.name?.message}
          label={t("placeholder.name")}
          name="name"
        />
        <div className="flex justify-between items-center gap-2 pt-2">
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {t("button.cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t("button.loading") : init ? t("button.save") : t("button.add")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TagForm;
