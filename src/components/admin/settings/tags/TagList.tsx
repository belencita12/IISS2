"use client";

import SearchBar from "@/components/global/SearchBar";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import TagTable from "./TagTable";
import { toast } from "@/lib/toast";
import TagForm from "./TagForm";
import { Tag } from "@/lib/tags/types";
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
  const [showDeleted, setShowDeleted] = useState(false);
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
    extraParams: {
      includeDeleted: showDeleted,
    },
  });

  const { delete: deleteTag, loading: isDelLoading } = useFetch<void, null>(
    "",
    token
  );

  const { patch: restoreTag, loading: isRestoring } = useFetch<Tag, null>(
    "",
    token
  );

  if (error) toast("error", error.message || "Error al cargar las etiquetas");

  const handleSearch = (query: string) => {
    if (query.length > 0) {
      search({ name: query, includeDeleted: showDeleted });
    } else {
      refresh();
    }
  };

  const toggleDeletedTags = () => {
    setShowDeleted(!showDeleted);
    search({ includeDeleted: !showDeleted });
  };

  const handleRestore = async (tag: Tag) => {
    const { ok, error } = await restoreTag(null, `${TAG_API}/restore/${tag.id}`);

    if (!ok) {
      return toast("error", error?.message || "Error al restaurar la etiqueta");
    }

    toast("success", "Etiqueta restaurada con éxito");
    refresh();
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">{showDeleted ? "Tags eliminados" : "Tags"}</h2>
          <div className="flex gap-2">
            <Button 
              variant={showDeleted ? "secondary" : "outline"}
              onClick={toggleDeletedTags}
              disabled={isRestoring}
            >
              {showDeleted ? "Ver activos" : "Ver eliminados"}
            </Button>
            <Button 
              onClick={onCreate} 
              className="px-6"
              disabled={isRestoring}
            >
              Agregar
            </Button>
          </div>
        </div>
        <TagTable
          emptyMessage="No se encontraron tags"
          onPageChange={setPage}
          handleEdit={onEdit}
          handleDel={onOpenDelModal}
          isRestoring={isRestoring}
          handleRestore={showDeleted ? handleRestore : undefined}
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
