"use client";
import { createContext, useContext } from "react";
import React from "react";
import { supabase } from "../lib/supabase";
import { dbTake } from "../lib/util";
import ProductProvider, {
  ProductContext,
  ProductContextType,
} from "./ProductProvider";

export type SearchContextType = {
  searchText: string;
  setSearchText: (text: string) => void;
  searchGroup: string;
  searchKey: string;
  currentStatus: boolean;
  size1: string;
  setSize1: (size: string) => void;
  size2: string;
  setSize2: (size: string) => void;
  size3: string;
  setSize3: (size: string) => void;
  itemList: string;
  setItemList: (itemList: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  tableSearchKey: string;
  setTableSearchKey: (key: string) => void;
  totalFound: number;
  setTotalFound: (found: number) => void;
  category: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleToggleStatus: () => void;
  handleSelect: (value: string, key: string) => void;
  handleSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSetCurrentPage: (page: number) => void;
  handleNextPage: (totalPage: number) => void;
  handlePrevPage: () => void;
  handleSort: (sortKey: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

type ProductProvider = {
  children: React.ReactNode;
};

export default function SearchProvider({ children }: ProductProvider) {
  const [searchText, setSearchText] = React.useState("");
  const [searchGroup, setSearchGroup] = React.useState("all");
  const [searchKey, setSearchKey] = React.useState("CODE");
  const [currentStatus, setCurrentStatus] = React.useState(true);
  const [size1, setSize1] = React.useState("");
  const [size2, setSize2] = React.useState("");
  const [size3, setSize3] = React.useState("");
  const [category, setCategory] = React.useState("I");
  const [itemList, setItemList] = React.useState("");
  const [totalFound, setTotalFound] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [tableSearchKey, setTableSearchKey] = React.useState("CODE");

  const { sortBy, setSortBy } = useContext(
    ProductContext
  ) as ProductContextType;

  async function getDataFromSearch(
    page: number,
    sortOrder: string,
    sortBy: string
  ) {
    let query = supabase
      .from("productInfo")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .limit(10)
      .range((page - 1) * dbTake, page * dbTake - 1);

    if (currentStatus) query.eq("STATUS", 1);

    if (searchKey === "CODE") {
      const searchWords = searchText.split(/[\s,]+/).map((word) => word.trim());
      const orSearchArr = searchWords.map(
        (word) =>
          ` \
      BCODE.ilike.%${word}%, \
      DESCR.ilike.%${word}%, \
      XCODE.ilike.%${word}%, \
      MCODE.ilike.%${word}%, \
      PCODE.ilike.%${word}%, \
      ACODE.ilike.%${word}%, \
      BRAND.ilike.%${word}%, \
      MODEL.ilike.%${word}%, \
      VENDOR.ilike.%${word}%`
      );
      orSearchArr.forEach((orSearch) => (query = query.or(orSearch)));

      if (searchGroup != "all") query = query.eq("MAIN", searchGroup);

      const { data, error, count } = await query;

      if (error) return;
      if (data !== null) setItemList(JSON.stringify(data));
      if (count !== null) setTotalFound(count);
    } else if (searchKey === "SIZE") {
      [size1, size2, size3].forEach((size, index) => {
        if (size !== "") query = query.or(`SIZE${index + 1}.ilike.${size}`);
      });

      query = query.eq("CODE1", category);

      const { data, error, count } = await query;

      if (error) return;
      if (count !== null) setTotalFound(count);
      if (data !== null) setItemList(JSON.stringify(data));
    }
  }

  function handleSetCurrentPage(page: number) {
    setCurrentPage(() => page);
    getDataFromSearch(page, sortOrder, sortBy);
  }

  function handleNextPage(totalPage: number) {
    if (currentPage < totalPage) {
      setCurrentPage((cur) => cur + 1);
    }
    getDataFromSearch(currentPage + 1, sortOrder, sortBy);
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((cur) => cur - 1);
    }
    getDataFromSearch(currentPage - 1, sortOrder, sortBy);
  }

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurrentPage(1);
    setSortBy("BCODE");
    setTableSearchKey(searchKey);
    getDataFromSearch(1, sortOrder, "BCODE");
  }

  function handleToggleStatus() {
    setCurrentStatus((cur) => !cur);
  }

  function handleSort(sortKey: string) {
    if (sortBy === sortKey) {
      setSortOrder((cur) => (cur === "asc" ? "desc" : "asc"));
      getDataFromSearch(1, sortOrder === "asc" ? "desc" : "asc", sortBy);
    } else {
      setSortBy(sortKey);
      setSortOrder("asc");
      getDataFromSearch(1, "asc", sortKey);
    }
  }

  function handleSelect(value: string, key: string) {
    setSearchKey(key);

    if (key === "CODE") {
      setSearchGroup(value);
    } else if (key === "SIZE") {
      setCategory(value);
    }
  }

  const value = {
    searchText,
    setSearchText,
    searchGroup,
    searchKey,
    currentStatus,
    sortOrder,
    setSortOrder,
    size1,
    setSize1,
    size2,
    setSize2,
    size3,
    setSize3,
    category,
    itemList,
    setItemList,
    totalFound,
    setTotalFound,
    handleToggleStatus,
    handleSelect,
    handleSubmitForm,
    handleSetCurrentPage,
    handleNextPage,
    handlePrevPage,
    currentPage,
    setCurrentPage,
    handleSort,
    tableSearchKey,
    setTableSearchKey,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
