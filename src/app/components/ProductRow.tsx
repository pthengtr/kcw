import React, { useContext } from "react";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { TableCell, TableRow } from "@/components/ui/table";
import { SearchContext, SearchContextType } from "./SearchProvider";
import { ItemDetailType } from "./ProductDetail";

type ProductRowProps = {
  item: ItemDetailType;
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
  const columnArray: (keyof ItemDetailType)[] =
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
        ] as (keyof ItemDetailType)[])
      : ([
          "BCODE",
          "DESCR",
          "MODEL",
          optCol[0],
          optCol[1],
          optCol[2],
        ] as (keyof ItemDetailType)[]);

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
          }`}
        >
          {col === "PRICENET1"
            ? parseFloat(item[col]).toLocaleString()
            : item[col as keyof typeof item]?.toString()}
        </TableCell>
      ))}
    </TableRow>
  );
}
