import React, { useContext } from "react";
import ProductOptionalColumn from "./ProductOptionalColumn";
import { useSearchParams } from "next/navigation";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sizeType } from "../lib/util";

export default function ProductColumnHeder() {
  const searchParams = useSearchParams();

  const {
    column1,
    column2,
    column3,
    setColumn1,
    setColumn2,
    setColumn3,
    handleSort,
  } = useContext(ProductContext) as ProductContextType;

  const setColumns = [setColumn1, setColumn2, setColumn3];
  const category: string = searchParams.get("category") || "I";

  const fixedColumns: Record<string, string | null> =
    searchParams.get("key") === "CODE"
      ? { BCODE: "รหัสสินค้า", DESCR: "ชื่อสินค้า", MODEL: "รุ่น" }
      : {
          BCODE: "รหัสสินค้า",
          DESCR: "ชื่อสินค้า",
          MODEL: "รุ่น",
          SIZE1: sizeType[category][0],
          SIZE2: sizeType[category][1],
          SIZE3: sizeType[category][2] || "ขนาด3",
        };

  const optColumns =
    searchParams.get("key") === "CODE"
      ? [column1, column2, column3]
      : [column1, column2];

  return (
    <TableHeader className="sticky top-0 bg-white">
      <TableRow>
        {Object.keys(fixedColumns).map((key) => (
          <TableHead key={key}>
            <button
              className="w-full text-left"
              onClick={() => handleSort(searchParams, key)}
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
              handleSort={() => handleSort(searchParams, col)}
            />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
