import { Input } from "@/components/ui/input";
import { SearchContext, SearchContextType } from "./SearchProvider";
import React, { useContext } from "react";

export default function ProductSearchTextInput() {
  const { searchText, setSearchText } = useContext(
    SearchContext
  ) as SearchContextType;
  return (
    <Input
      className="rounded-l-none rounded-r-md flex-1"
      type="text"
      placeholder="ชือ หรือ รหัสสินค้า..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
}
