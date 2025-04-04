import FormInput from "@/components/global/FormInput";
import { Modal } from "@/components/global/Modal";
import { Button } from "@/components/ui/button";
import { editTag, registerTag } from "@/lib/tags/service";
import { Tag } from "@/lib/tags/types";
import { toast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    formState: { errors, isSubmitting },
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

  if (!isOpen) return null;

  const onSubmit = async (data: TagForm) => {
    try {
      let resultTag: Tag;
      if (init) {
        resultTag = await editTag(token, init.id, data.name);
        toast("success", "Etiqueta editada con éxito");
      } else {
        resultTag = await registerTag(token, data.name);
        toast("success", "Etiqueta creada con éxito");
      }
      if (afterSubmit) afterSubmit(resultTag);
      reset();
      onClose();
    } catch (error) {
      toast("error", "Error al guardar la etiqueta");
    }
  };

  return (
    <Modal
      title={init ? "Editar Etiqueta" : "Crear Etiqueta"}
      isOpen={isOpen || isSubmitting}
      onClose={onClose}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          register={register("name")}
          error={errors.name?.message}
          label="Nombre"
          name="name"
        />
        <div className="flex justify-between items-center gap-2 pt-2">
          <Button
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cargando..." : init ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TagForm;
