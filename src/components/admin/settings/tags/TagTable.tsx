import GenericTable, {
  Column,
  GenericTableProps,
  TableAction,
} from "@/components/global/GenericTable";
import { Tag } from "@/lib/tags/types";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import TagTableSkeleton from "./TagTableSkeleton";

export type TagTableProps = Omit<
  GenericTableProps<Tag>,
  "actions" | "columns"
> & {
  token: string;
  handleEdit: (tag: Tag) => void;
  handleDel: (tag: Tag) => void;
};

const TagTable = ({ handleEdit, handleDel, ...props }: TagTableProps) => {
  const actions: TableAction<Tag>[] = [
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: handleEdit,
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: handleDel,
      label: "Eliminar",
    },
  ];

  const columns: Column<Tag>[] = [
    {
      header: "Tag",
      accessor: "name",
    },
  ];

  return (
    <>
      <GenericTable
        {...props}
        skeleton={<TagTableSkeleton />}
        columns={columns}
        actions={actions}
      />
    </>
  );
};

export default TagTable;
