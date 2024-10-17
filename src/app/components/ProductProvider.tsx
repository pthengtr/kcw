"use client";
import { createContext } from "react";
import React from "react";
import { productType } from "./ProductDetail";

export type ProductContextType = {
  selectedItem: string;
  setSelectedItem: (key: string) => void;
  sortBy: string;
  setSortBy: (key: string) => void;
  column1: string;
  setColumn1: (column: string) => void;
  column2: string;
  setColumn2: (column: string) => void;
  column3: string;
  setColumn3: (column: string) => void;
  activeRow: string;
  setActiveRow: (row: string) => void;
  productDetail: productType | undefined;
  setProductDetail: (productDetail: productType | undefined) => void;
  handleSelectItem: (item: string) => void;
};

export const ProductContext = createContext<ProductContextType | null>(null);

type ProductProvider = {
  children: React.ReactNode;
};

export default function ProductProvider({ children }: ProductProvider) {
  const [selectedItem, setSelectedItem] = React.useState("");
  const [sortBy, setSortBy] = React.useState("BCODE");
  const [column1, setColumn1] = React.useState("BRAND");
  const [column2, setColumn2] = React.useState("LOCATION1");
  const [column3, setColumn3] = React.useState("PRICE1");
  const [activeRow, setActiveRow] = React.useState("");
  const [productDetail, setProductDetail] = React.useState<productType>();

  function handleSelectItem(bcode: string) {
    setSelectedItem(bcode);
    setActiveRow(bcode);
  }

  const value = {
    selectedItem,
    setSelectedItem,
    sortBy,
    setSortBy,
    column1,
    setColumn1,
    column2,
    setColumn2,
    column3,
    setColumn3,
    activeRow,
    setActiveRow,
    handleSelectItem,
    productDetail,
    setProductDetail,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
