import React, { useContext } from "react";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { TableCell, TableRow } from "@/components/ui/table";
import { SearchContext, SearchContextType } from "../SearchProvider";
import { productType } from "./ProductProvider";

type ProductRowProps = {
  item: productType;
};

export default function ProductRow({ item }: ProductRowProps) {
  const { tableSearchKey } = useContext(SearchContext) as SearchContextType;

  const {
    column1,
    column2,
    column3,
    selectedItem,
    handleSelectItem,
    activeRow,
  } = useContext(ProductContext) as ProductContextType;
  const optCol = [column1, column2, column3];
  const columnArray: (keyof productType)[] =
    tableSearchKey === "SIZE"
      ? ([
          "BCODE",
          "DESCR",
          "MODEL",
          "SIZE1",
          "SIZE2",
          "SIZE3",
          optCol[0],
          optCol[1],
        ] as (keyof productType)[])
      : ([
          "BCODE",
          "DESCR",
          "MODEL",
          optCol[0],
          optCol[1],
          optCol[2],
        ] as (keyof productType)[]);

  return (
    <TableRow
      className={`hover:bg-blue-100 odd:bg-gray-100 ${
        activeRow === item.BCODE &&
        activeRow !== selectedItem &&
        "outline outline-secondary"
      }`}
      onClick={() => handleSelectItem(item.BCODE)}
      id={item.BCODE}
    >
      {columnArray.map((col, i) => (
        <TableCell
          key={`${item.BCODE}-${i}`}
          className={`${
            item.BCODE === selectedItem && "bg-primary text-white"
          } ${
            activeRow === item.BCODE &&
            activeRow !== selectedItem &&
            "bg-red-50"
          } ${col === "PRICE1" ? "text-right" : ""}`}
        >
          {col === "DESCR" && item.ISVAT === "Y" && (
            <span className="bg-secondary text-white px-1 rounded-sm text-xs">
              VAT
            </span>
          )}{" "}
          {col === "PRICE1"
            ? item[col].toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : item[col as keyof typeof item]?.toString()}
        </TableCell>
      ))}

      <TableCell
        key={`${item.BCODE}-QTYOH2`}
        className={`${item.BCODE === selectedItem && "bg-primary text-white"} ${
          activeRow === item.BCODE && activeRow !== selectedItem && "bg-red-50"
        } text-right`}
      >
        {item.inventory.QTYOH2}
      </TableCell>
    </TableRow>
  );
}
