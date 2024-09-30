"use client";
import React, { useContext } from "react";
import ProductHeader from "./ProductHeader";
import ProductMain from "./ProductMain";
import { SearchContext, SearchContextType } from "./SearchProvider";

export default function ProductSearchPage() {
  const { itemList, totalFound } = useContext(
    SearchContext
  ) as SearchContextType;
  return (
    <div className="flex flex-col gap-2 h-full">
      <ProductHeader />
      <ProductMain itemListJson={itemList} totalFound={totalFound} />
    </div>
  );
}
