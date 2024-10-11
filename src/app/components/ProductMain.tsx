"use client";
import ProductTable from "./ProductTable";
import ProductPagination from "@/app/components/ProductPagination";
import ProductDetail from "./ProductDetail";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";

type ProductMainProps = {
  itemListJson: string;
  totalFound: number;
};

export default function ProductMain({
  itemListJson,
  totalFound,
}: ProductMainProps) {
  const itemList = itemListJson ? JSON.parse(itemListJson) : "";

  return (
    <main className="h-[90%]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="w-1/2 flex flex-col items-center h-full  overflow-auto">
          {itemList !== "" && (
            <>
              <div className="w-full overflow-auto">
                <ProductTable itemList={itemList} />
              </div>
              <ProductPagination totalFound={totalFound} />
            </>
          )}
        </ResizablePanel>
        <ResizableHandle className="p-0.5 m-1 bg-slate-100 " />
        <ResizablePanel className="w-1/2 h-full">
          <ProductDetail />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
