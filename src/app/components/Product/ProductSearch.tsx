"use client";
import { ProductContext, ProductContextType } from "./ProductProvider";
import ProductSearchOption from "./ProductSearchOption";
import ProductSearchSizeInput from "./ProductSearchSizeInput";
import ProductSearchTextInput from "./ProductSearchTextInput";

import { SearchContext, SearchContextType } from "../SearchProvider";
import React, { useContext, useEffect } from "react";

export default function ProductSearch() {
  const { setItemList, searchKey, setSearchKey, setSearchText } = useContext(
    SearchContext
  ) as SearchContextType;

  const { setProductDetail, setSelectedItem } = useContext(
    ProductContext
  ) as ProductContextType;

  useEffect(() => {
    setSearchText("");
    setSearchKey("CODE");
    setItemList(undefined);
    setProductDetail(undefined);
    setSelectedItem("");
  }, [
    setSearchText,
    setSearchKey,
    setItemList,
    setProductDetail,
    setSelectedItem,
  ]);

  return (
    <>
      <ProductSearchOption />
      {searchKey === "CODE" && <ProductSearchTextInput />}
      {searchKey === "SIZE" && <ProductSearchSizeInput />}
    </>
  );
}
