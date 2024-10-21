"use client";
import React, { useContext } from "react";
import ProductTable from "@/app/components/Product/ProductTable";
import ProductPagination from "@/app/components/Product/ProductPagination";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SearchContext, SearchContextType } from "../SearchProvider";
import PosProductDetail from "./PosProductDetail";
import PosBill from "./PosBill";

export default function PosPage() {
  const { itemList, totalFound } = useContext(
    SearchContext
  ) as SearchContextType;
  return (
    <main className="h-[90%]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={45}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel className="w-full flex flex-col items-center h-full  overflow-auto">
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
            <ResizablePanel className="w-full h-full">
              <PosProductDetail />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle className="p-0.5 m-1 bg-slate-100 " />
        <ResizablePanel className="w-full">
          <PosBill />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
