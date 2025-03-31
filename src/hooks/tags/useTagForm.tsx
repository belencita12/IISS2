import { useState } from "react";
import { Tag } from "@/lib/tags/types";

export const useTagForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>();

  const onCreate = () => {
    setSelectedTag(undefined);
    setIsFormOpen(true);
  };

  const onEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsFormOpen(true);
  };

  const onClose = () => {
    setSelectedTag(undefined);
    setIsFormOpen(false);
  };

  return {
    isFormOpen,
    selectedTag,
    setSelectedTag,
    onCreate,
    onEdit,
    onClose,
  };
};
