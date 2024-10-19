import React, { useContext } from "react";
import ProductOptionalColumn from "./ProductOptionalColumn";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sizeType } from "../../lib/util";
import { SearchContext, SearchContextType } from "../SearchProvider";

export default function ProductColumnHeder() {
  const { column1, column2, column3, setColumn1, setColumn2, setColumn3 } =
    useContext(ProductContext) as ProductContextType;

  const { handleSort } = useContext(SearchContext) as SearchContextType;

  const { category, tableSearchKey } = useContext(
    SearchContext
  ) as SearchContextType;

  const setColumns = [setColumn1, setColumn2, setColumn3];

  const fixedColumns: Record<string, string | null> =
    tableSearchKey === "SIZE"
      ? {
          BCODE: "รหัสสินค้า",
          DESCR: "ชื่อสินค้า",
          MODEL: "รุ่น",
          SIZE1: sizeType[category][0],
          SIZE2: sizeType[category][1],
          SIZE3: sizeType[category][2] || "ขนาด3",
        }
      : { BCODE: "รหัสสินค้า", DESCR: "ชื่อสินค้า", MODEL: "รุ่น" };

  const optColumns =
    tableSearchKey === "SIZE"
      ? [column1, column2]
      : [column1, column2, column3];

  return (
    <TableHeader className="sticky top-0 bg-white">
      <TableRow>
        {Object.keys(fixedColumns).map((key) => (
          <TableHead key={key}>
            <button
              className="w-full text-left outline-none"
              onClick={() => handleSort(key)}
            >
              {fixedColumns[key]}
            </button>
          </TableHead>
        ))}

        {optColumns.map((col, index) => (
          <TableHead key={`${col}-${index}`}>
            <ProductOptionalColumn
              column={col}
              setColumn={setColumns[index]}
              handleSort={() => handleSort(col)}
            />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
