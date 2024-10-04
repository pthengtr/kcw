"use client";
import React, { useContext } from "react";

import ProductMain from "./ProductMain";
import { SearchContext, SearchContextType } from "./SearchProvider";

export default function ProductSearchPage() {
  const { itemList, totalFound } = useContext(
    SearchContext
  ) as SearchContextType;
  return <ProductMain itemListJson={itemList} totalFound={totalFound} />;
}
