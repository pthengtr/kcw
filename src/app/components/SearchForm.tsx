"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { SearchContext, SearchContextType } from "./SearchProvider";
import { usePathname } from "next/navigation";
import ProductSearch from "./Product/ProductSearch";
import TransactionSearch from "./Transaction/TransactionSearch";

export default function SearchForm() {
  const { handleSubmitForm } = useContext(SearchContext) as SearchContextType;

  const pathName = usePathname();

  return (
    <form onSubmit={handleSubmitForm} className="flex gap-2 items-center">
      <div className="w-[500px] flex flex-auto shadow-lg relative">
        {pathName === "/product" && <ProductSearch />}
        {pathName === "/sales" && <TransactionSearch />}
        {pathName === "/purchases" && <TransactionSearch />}
      </div>
      {pathName === "/product" && (
        <Button className="bg-gray-100 text-gray-800 shadow-lg font-semibold hover:bg-slate-200 hover:scale-[1.02] active:scale-[1]">
          ค้นหา
        </Button>
      )}
    </form>
  );
}
