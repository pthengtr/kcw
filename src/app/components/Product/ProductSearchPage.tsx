"use client";
import React, { useContext } from "react";
import ProductTable from "./ProductTable";
import ProductPagination from "@/app/components/Product/ProductPagination";
import ProductDetail from "./ProductDetail";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SearchContext, SearchContextType } from "../SearchProvider";

export default function ProductSearchPage() {
  const { itemList, totalFound } = useContext(
    SearchContext
  ) as SearchContextType;
  return (
    <main className="h-[90%]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="w-1/2 flex flex-col items-center h-full  overflow-auto">
          {!!itemList && itemList.length > 0 && (
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
