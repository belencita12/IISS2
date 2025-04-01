"use client";

import SearchBar from "@/components/global/SearchBar";
import { Button } from "@/components/ui/button";
import { useGetTags } from "@/hooks/tags/useGetTags";
import React, { useState } from "react";
import TagTable from "./TagTable";
import { toast } from "@/lib/toast";
import TagForm from "./TagForm";
import { Tag } from "@/lib/tags/types";
import { useDelTag } from "@/hooks/tags/useDelTag";
import { ConfirmationModal } from "@/components/global/Confirmation-modal";
import { useTagForm } from "@/hooks/tags/useTagForm";

type TagListProps = {
  token: string;
};

const TagList = ({ token }: TagListProps) => {
  const { delTag } = useDelTag({ token });
  const [isDelOpen, setIsDelOpen] = useState(false);
  const { selectedTag, isFormOpen, setSelectedTag, onCreate, onEdit, onClose } =
    useTagForm();
  const { data, isLoading, error, query, setQuery, setData, onPageChange } =
    useGetTags({
      token,
    });

  if (error) toast("error", error);

  const handleSearch = (query: string) => {
    setQuery({ page: 1, name: query.length > 0 ? query : undefined });
  };

  // Delete logic
  const onCloseDelModal = () => setIsDelOpen(false);

  const onOpenDelModal = (tag: Tag) => {
    setSelectedTag(tag);
    setIsDelOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTag) return;
    await delTag(selectedTag.id);
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        data: prev.data.filter((tag) => tag.id !== selectedTag.id),
      };
    });
  };

  // Create / Update logic
  const handleSubmit = (tag: Tag) => {
    const isEdit = selectedTag && selectedTag.id === tag.id;
    setData((prev) => {
      if (!prev) return null;
      if (isEdit)
        return {
          ...prev,
          data: prev.data.map((t) => (t.id === tag.id ? tag : t)),
        };
      return { ...prev, data: [tag, ...prev.data] };
    });
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
          onPageChange={onPageChange}
          handleEdit={onEdit}
          handleDel={onOpenDelModal}
          token={token}
          isLoading={isLoading}
          data={data?.data || []}
          pagination={{
            currentPage: query.page,
            totalPages: data?.totalPages || 1,
            totalItems: data?.total || 0,
            pageSize: data?.size || 10,
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
