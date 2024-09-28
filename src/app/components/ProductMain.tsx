"use client";
import React, { Suspense } from "react";
import ProductTable from "./ProductTable";
import ProductPagination from "@/app/components/ProductPagination";
import ProductDetail from "./ProductDetail";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type ProductMainProps = {
  itemListJson: string;
  totalFound: number;
};

export default function ProductMain({
  itemListJson,
  totalFound,
}: ProductMainProps) {
  const itemList = JSON.parse(itemListJson);

  return (
    <Suspense>
      <main className="h-[90%]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="w-1/2 flex flex-col items-center h-full ">
            <ProductTable itemList={itemList} />
            <ProductPagination totalFound={totalFound} />
          </ResizablePanel>
          <ResizableHandle withHandle className="p-0.5 m-1 bg-slate-100 " />
          <ResizablePanel className="w-1/2 h-full">
            <ProductDetail />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </Suspense>
  );
}
