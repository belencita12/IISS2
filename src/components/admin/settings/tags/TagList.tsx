"use client";

import SearchBar from "@/components/global/SearchBar";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import TagTable from "./TagTable";
import { toast } from "@/lib/toast";
import TagForm from "./TagForm";
import { Tag } from "@/lib/tags/types";
import { useDelTag } from "@/hooks/tags/useDelTag";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { useTagForm } from "@/hooks/tags/useTagForm";
import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { TAG_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api";

type TagListProps = {
  token: string;
};

const TagList = ({ token }: TagListProps) => {
  const [isDelOpen, setIsDelOpen] = useState(false);
  const { selectedTag, isFormOpen, setSelectedTag, onCreate, onEdit, onClose } =
    useTagForm();

  const {
    data,
    loading: isLoading,
    error,
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 },
    setPage,
    refresh,
    search,
  } = usePaginatedFetch<Tag>(TAG_API, token, {
    initialPage: 1,
    size: 10,
    autoFetch: true,
  });

  const { delete: deleteTag, loading: isDelLoading } = useFetch<void, null>(
    "",
    token
  );

  if (error) toast("error", error.message || "Error al cargar las etiquetas");

  const handleSearch = (query: string) => {
    if (query.length > 0) {
      search({ name: query });
    } else {
      refresh();
    }
  };

  // Delete logic
  const onCloseDelModal = () => setIsDelOpen(false);

  const onOpenDelModal = (tag: Tag) => {
    setSelectedTag(tag);
    setIsDelOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTag) return;

    const { ok, error } = await deleteTag(null, `${TAG_API}/${selectedTag.id}`);

    if (!ok) {
      return toast("error", error?.message || "Error al eliminar la etiqueta");
    }

    toast("success", "Etiqueta eliminada con éxito");
    refresh();
    onCloseDelModal();
  };

  const handleSubmit = () => {
    refresh();
  };

  return (
    <>
      <div className="p-4 mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <SearchBar onSearch={handleSearch} placeholder="Buscar tag..." />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Tags</h2>
          <Button onClick={onCreate} className="px-6">
            Agregar
          </Button>
        </div>
        <TagTable
          emptyMessage="No se encontraron tags"
          onPageChange={setPage}
          handleEdit={onEdit}
          handleDel={onOpenDelModal}
          token={token}
          isLoading={isLoading}
          data={data || []}
          pagination={{
            currentPage: pagination?.currentPage || 1,
            totalPages: pagination?.totalPages || 1,
            totalItems: pagination?.totalItems || 0,
            pageSize: pagination?.pageSize || 10,
          }}
        />
      </div>
      <TagForm
        token={token}
        afterSubmit={handleSubmit}
        isOpen={isFormOpen}
        init={selectedTag}
        onClose={onClose}
      />
      <ConfirmationModal
        isOpen={isDelOpen}
        isLoading={isDelLoading}
        onClose={onCloseDelModal}
        onConfirm={handleDelete}
        title="Eliminar"
        message={`¿Seguro que quieres eliminar el tag "${selectedTag?.name}?"`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
};

export default TagList;
