import { Input } from "@/components/ui/input";
import { sizeType } from "../lib/util";
import { SearchContext, SearchContextType } from "./SearchProvider";
import React, { useContext } from "react";

export default function ProductSearchSizeInput() {
  const { size1, setSize1, size2, setSize2, size3, setSize3, category } =
    useContext(SearchContext) as SearchContextType;
  return (
    <div className="flex flex-1 w-32">
      <Input
        className="min-w-12 rounded-none"
        type="text"
        placeholder={sizeType[category][0]}
        value={size1}
        onChange={(e) => setSize1(e.target.value)}
      />
      <Input
        className="min-w-12 rounded-none"
        type="text"
        placeholder={sizeType[category][1]}
        value={size2}
        onChange={(e) => setSize2(e.target.value)}
      />
      <Input
        className="min-w-12 rounded-l-none rounded-r-md"
        type="text"
        placeholder={sizeType[category][2] || ""}
        disabled={sizeType[category][2] ? false : true}
        value={size3}
        onChange={(e) => setSize3(e.target.value)}
      />
    </div>
  );
}
