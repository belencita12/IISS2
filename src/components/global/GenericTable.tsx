"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
};

export type TableAction<T> = {
  icon: React.ReactNode;
  onClick: (item: T) => void;
  label: string;
};

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  actionsTitle?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  skeleton?: React.ReactNode;
  className?: string;
}

export default function GenericTable<T extends { id?: string | number }>({
  data,
  columns,
  actions,
  actionsTitle="Acciones",
  pagination,
  onPageChange,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  className,
  skeleton,
}: GenericTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  // Update local state when pagination props change
  useEffect(() => {
    if (pagination?.currentPage) {
      setCurrentPage(pagination.currentPage);
    }
  }, [pagination?.currentPage]);

  if (isLoading) {
    return skeleton ? (
      <div className={className}>{skeleton}</div>
    ) : (
      <div className="py-8 text-center">Cargando datos...</div>
    );
  }

  if (data.length === 0) {
    return <p className="text-center py-4">{emptyMessage}</p>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePreviousPage = () => {
    const newPage = currentPage - 1;
    if (newPage >= 1) {
      handlePageChange(newPage);
    }
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    if (!pagination?.totalPages || newPage <= pagination.totalPages) {
      handlePageChange(newPage);
    }
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    const accessor = column.accessor;
    
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    
    return item[accessor] as React.ReactNode;
  };

  // Calculate total pages for both API and client-side pagination
  const totalPages = pagination?.totalPages || 1;
  const showPagination = totalPages > 1;

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#E9EAEF]">
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {actions && actions.length > 0 && (
              <TableHead className="text-right">{actionsTitle}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow key={item.id !== undefined ? item.id : rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.className}>
                  {renderCellContent(item, column)}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell className="text-right flex gap-2 justify-end">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => action.onClick(item)}
                      aria-label={action.label}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      {action.icon}
                    </button>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && (
        <Pagination className="pt-6 pb-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              // Show only 5 page links at a time with ellipsis
              .filter(page => {
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                return false;
              })
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    className={currentPage === page ? "font-bold bg-gray-200" : ""}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}