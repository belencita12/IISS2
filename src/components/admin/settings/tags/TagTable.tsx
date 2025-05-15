import GenericTable, {
  Column,
  GenericTableProps,
  TableAction,
} from "@/components/global/GenericTable";
import { Tag } from "@/lib/tags/types";
import { Pencil, Trash, Undo2 } from "lucide-react";
import React from "react";
import TagTableSkeleton from "./TagTableSkeleton";

export type TagTableProps = Omit<
  GenericTableProps<Tag>,
  "actions" | "columns"
> & {
  token: string;
  handleEdit: (tag: Tag) => void;
  handleDel: (tag: Tag) => void;
  handleRestore?: (tag: Tag) => void;
  isRestoring?: boolean;
};

const TagTable = ({
  handleEdit,
  handleDel,
  handleRestore,
  isRestoring,
  isLoading,
  ...props
}: TagTableProps) => {
  if (isLoading) return <TagTableSkeleton />;

  const columns: Column<Tag>[] = [
    {
      header: "Tag",
      accessor: "name",
    },
  ];

  const actions: TableAction<Tag>[] = [
    ...(handleRestore
      ? [
          {
            icon: <Undo2 className={`w-4 h-4 ${isRestoring ? 'opacity-50' : ''}`} />,
            label: isRestoring ? "Restaurando..." : "Restaurar",
            onClick: (tag: Tag) => {
              if (!isRestoring && handleRestore) {
                handleRestore(tag);
              }
            },
          },
        ]
      : [
          {
            icon: <Pencil className="w-4 h-4" />,
            label: "Editar",
            onClick: handleEdit,
          },
          {
            icon: <Trash className="w-4 h-4" />,
            label: "Eliminar",
            onClick: handleDel,
          },
        ]),
  ];

  return (
    <GenericTable
      {...props}
      columns={columns}
      actions={actions}
    />
  );
};

export default TagTable;
