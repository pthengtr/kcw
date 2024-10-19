import React, { useContext } from "react";
import PaginationNext from "@/app/components/Product/PaginationNext";
import PaginationPrev from "@/app/components/Product/PaginationPrev";
import { SearchContext, SearchContextType } from "../SearchProvider";
import { dbTake } from "../../lib/util";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

type ProductPaginationProps = {
  totalFound: number;
};

export default function ProductPagination({
  totalFound,
}: ProductPaginationProps) {
  const totalPage = Math.ceil((Number(totalFound) / dbTake) as number);
  const totalPageArray = Array.from(Array(totalPage).keys()).map((i) => i + 1);

  const { handleNextPage, handlePrevPage, currentPage, handleSetCurrentPage } =
    useContext(SearchContext) as SearchContextType;

  return (
    <section className="flex items-center p-2 bg-gray-100 w-full mt-auto">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrev handlePrevPage={() => handlePrevPage()} />
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
                      onClick={() => handleSetCurrentPage(page)}
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
            <PaginationNext handleNextPage={() => handleNextPage(totalPage)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="px-4 text-nowrap">{totalFound} รายการ</div>
    </section>
  );
}
