"use client";
import { createContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export type ProductContextType = {
  selectedItem: string;
  sortBy: string;
  setSortBy: (key: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  column1: string;
  setColumn1: (column: string) => void;
  column2: string;
  setColumn2: (column: string) => void;
  column3: string;
  setColumn3: (column: string) => void;
  category: string;
  setCategory: (category: string) => void;
  activeRow: string;
  setActiveRow: (row: string) => void;
  handleSelectItem: (item: string) => void;
  handleSetCurrentPage: (searchParams: URLSearchParams, page: number) => void;
  handleNextPage: (searchParams: URLSearchParams, totalPage: number) => void;
  handlePrevPage: (searchParams: URLSearchParams) => void;
  handleSort: (searchParams: URLSearchParams, sortKey: string) => void;
};

export const ProductContext = createContext<ProductContextType | null>(null);

type ProductProvider = {
  children: React.ReactNode;
};

export default function ProductProvider({ children }: ProductProvider) {
  const [selectedItem, setSelectedItem] = React.useState("");
  const [sortBy, setSortBy] = React.useState("BCODE");
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [column1, setColumn1] = React.useState("BRAND");
  const [column2, setColumn2] = React.useState("LOCATION1");
  const [column3, setColumn3] = React.useState("PRICENET1");
  const [category, setCategory] = React.useState("I");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeRow, setActiveRow] = React.useState("");
  const pathName = usePathname();
  const router = useRouter();

  function handleSort(searchParams: URLSearchParams, sortKey: string) {
    if (sortBy === sortKey) {
      setSortOrder((cur) => (cur === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(sortKey);
      setSortOrder("asc");
    }
    createUrlWithSort(
      searchParams,
      sortKey,
      sortOrder === "asc" ? "desc" : "asc",
      currentPage
    );
  }

  function createUrlWithSort(
    searchParams: URLSearchParams,
    order: string,
    direction: string,
    page: number
  ) {
    let newUrl: string = "?";
    searchParams.forEach((key, value) => {
      if (value != "page" && value != "order" && value != "direction")
        newUrl = newUrl + `${value}=${key}&`;
    });
    newUrl =
      pathName + newUrl + `page=${page}&order=${order}&direction=${direction}`;

    router.push(newUrl);
  }

  function handleSetCurrentPage(searchParams: URLSearchParams, page: number) {
    setCurrentPage(() => page);
    createUrlWithSort(searchParams, sortBy, sortOrder, page);
  }

  function handleNextPage(searchParams: URLSearchParams, totalPage: number) {
    if (currentPage < totalPage) {
      setCurrentPage((cur) => cur + 1);
      createUrlWithSort(searchParams, sortBy, sortOrder, currentPage + 1);
    }
  }

  function handlePrevPage(searchParams: URLSearchParams) {
    if (currentPage > 1) {
      setCurrentPage((cur) => cur - 1);
      createUrlWithSort(searchParams, sortBy, sortOrder, currentPage - 1);
    }
  }

  function handleSelectItem(bcode: string) {
    setSelectedItem(bcode);
    setActiveRow(bcode);
  }

  const value = {
    selectedItem,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    column1,
    setColumn1,
    column2,
    setColumn2,
    column3,
    setColumn3,
    category,
    setCategory,
    activeRow,
    setActiveRow,
    handleSelectItem,
    handleSetCurrentPage,
    handleNextPage,
    handlePrevPage,
    handleSort,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
