"use client";
import React, { useContext, Suspense } from "react";
import ProductTable from "./ProductTable";
import ProductPagination from "@/app/components/ProductPagination";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  ProductContext,
  ProductContextType,
} from "@/app/components/ProductProvider";

type ProductMainProps = {
  itemListJson: string;
  totalFound: number;
};

export default function ProductMain({
  itemListJson,
  totalFound,
}: ProductMainProps) {
  const { selectedItem } = useContext(ProductContext) as ProductContextType;

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
            <iframe
              className="w-full h-full"
              src={`/product/${selectedItem}`}
            ></iframe>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </Suspense>
  );
}
