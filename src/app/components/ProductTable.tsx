import React, { useContext, useEffect } from "react";
import ProductRow from "./ProductRow";
import ProductColumnHeader from "./ProductColumnHeader";
import { ProductInfo } from "@prisma/client";
import { Table, TableBody } from "@/components/ui/table";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { dbTake } from "../lib/util";

type ProductTableProps = {
  itemList: ProductInfo[];
};

export default function ProductTable({ itemList }: ProductTableProps) {
  const { activeRow, setActiveRow, selectedItem, handleSelectItem } =
    useContext(ProductContext) as ProductContextType;

  useEffect(() => {
    function handleUpdateActiveRow(event: KeyboardEvent) {
      const { key } = event;
      const currentIndex = itemList.findIndex(
        (item) => item.BCODE === activeRow
      );

      if (key === "ArrowUp") {
        if (currentIndex <= 0) return;
        setActiveRow(
          activeRow === "" ? selectedItem : itemList[currentIndex - 1].BCODE
        );
        scrollToActiveRow(
          activeRow === "" ? selectedItem : itemList[currentIndex - 1].BCODE
        );
      } else if (key === "ArrowDown") {
        if (currentIndex >= dbTake) return;
        setActiveRow(
          activeRow === "" ? selectedItem : itemList[currentIndex + 1].BCODE
        );
        scrollToActiveRow(
          activeRow === "" ? selectedItem : itemList[currentIndex + 1].BCODE
        );
      } else if (key === "Enter" || key === "ArrowRight") {
        handleSelectItem(itemList[currentIndex].BCODE);
      }
    }

    function scrollToActiveRow(bcode: string) {
      const element = document.getElementById(bcode);
      if (element !== null)
        element.scrollIntoView({
          block: "center",
          inline: "start",
        });
    }

    window.addEventListener("keydown", handleUpdateActiveRow);

    return () => {
      window.removeEventListener("keydown", handleUpdateActiveRow);
    };
  }, [activeRow, setActiveRow, itemList, handleSelectItem, selectedItem]);

  return (
    <Table className="w-full relative">
      <ProductColumnHeader />
      <TableBody>
        {itemList.map((item) => (
          <ProductRow key={item.BCODE} item={item} />
        ))}
      </TableBody>
    </Table>
  );
}
