import React, { useContext } from "react";
import PaginationNext from "@/app/components/PaginationNext";
import PaginationPrev from "@/app/components/PaginationPrev";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { dbTake } from "../lib/util";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

type ProductPaginationProps = {
  totalFound: number;
};

export default function ProductPagination({
  totalFound,
}: ProductPaginationProps) {
  const totalPage = Math.ceil((Number(totalFound) / dbTake) as number);
  const totalPageArray = Array.from(Array(totalPage).keys()).map((i) => i + 1);

  const searchParams = useSearchParams();
  const { handleNextPage, handlePrevPage, currentPage, handleSetCurrentPage } =
    useContext(ProductContext) as ProductContextType;

  return (
    <section className="p-2 bg-gray-100 w-full mt-auto">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrev
              handlePrevPage={() => handlePrevPage(searchParams)}
            />
          </PaginationItem>

          {totalPageArray.map((page) => {
            const upper = currentPage < 6 ? 5 - currentPage : 0;
            const lower =
              currentPage > totalPage - 5 ? 4 - (totalPage - currentPage) : 0;

            if (
              (page < currentPage + 3 + upper &&
                page > currentPage - 3 - lower) ||
              page === 1 ||
              page === totalPage
            ) {
              return (
                <React.Fragment key={page}>
                  {page === totalPage && currentPage < totalPage - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handleSetCurrentPage(searchParams, page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  {page === 1 && currentPage > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </React.Fragment>
              );
            }
          })}

          <PaginationItem>
            <PaginationNext
              handleNextPage={() => handleNextPage(searchParams, totalPage)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
