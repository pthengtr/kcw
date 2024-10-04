"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";

import { SearchContext, SearchContextType } from "./SearchProvider";
import ProductSearchOption from "./ProductSearchOption";
import ProductSearchSizeInput from "./ProductSearchSizeInput";
import ProductSearchTextInput from "./ProductSearchTextInput";

export default function SearchForm() {
  const { searchKey, handleSubmitForm } = useContext(
    SearchContext
  ) as SearchContextType;

  return (
    <form onSubmit={handleSubmitForm} className="flex gap-2 items-center">
      <div className="w-[500px] flex flex-auto shadow-lg">
        <ProductSearchOption />
        {searchKey === "CODE" && <ProductSearchTextInput />}
        {searchKey === "SIZE" && <ProductSearchSizeInput />}
      </div>
      <Button className="bg-gray-100 h-full text-gray-800 shadow-lg font-semibold hover:bg-slate-200 hover:scale-[1.02] active:scale-[1]">
        ค้นหา
      </Button>
    </form>
  );
}
