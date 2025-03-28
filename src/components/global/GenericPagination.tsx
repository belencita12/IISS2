import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type GenericPaginationProps = {
  handlePreviousPage: () => void;
  handlePageChange: (page: number) => void;
  handleNextPage: () => void;
  currentPage: number;
  totalPages: number;
};

const GenericPagination = ({
  handlePreviousPage,
  handlePageChange,
  handleNextPage,
  currentPage,
  totalPages,
}: GenericPaginationProps) => {
  const showPagination = totalPages > 1;

  const calculatePages = () => {
    const pages = [];
    if (totalPages <= 5)
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    else {
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push(-1);

      pages.push(totalPages);
    }
    return pages;
  };

  if (!showPagination) return null;

  return (
    <Pagination className="pt-6 pb-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === 1}
          >
            <ChevronsLeft />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePreviousPage();
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === 1}
          >
            <ChevronLeft />
          </PaginationLink>
        </PaginationItem>

        {calculatePages().map((page, i) => {
          if (page > 0)
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  className={
                    currentPage === page ? "font-bold bg-gray-200" : ""
                  }
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );

          return (
            <PaginationItem key={`${page}-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNextPage();
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === totalPages}
          >
            <ChevronsRight />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GenericPagination;
