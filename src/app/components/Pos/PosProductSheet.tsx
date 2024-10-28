import PosProductDetail from "./PosProductDetail";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ProductTable from "@/app/components/Product/ProductTable";
import ProductPagination from "@/app/components/Product/ProductPagination";
import ProductSearch from "../Product/ProductSearch";
import { SearchContext, SearchContextType } from "../SearchProvider";
import { Button } from "@/components/ui/button";
import { useContext } from "react";

export default function PosProductSheet() {
  const { itemList, totalFound, handleSubmitForm } = useContext(
    SearchContext
  ) as SearchContextType;
  return (
    <Sheet>
      <SheetTrigger className="bg-gray-100 text-base p-2 rounded-md hover:bg-gray-200">
        ค้นหาสินค้า
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-[100%] overflow-auto flex">
        <div className="w-2/3">
          <form
            onSubmit={handleSubmitForm}
            className="flex gap-2 items-center w-[500px] mx-auto"
          >
            <div className="w-[500px] flex flex-auto shadow-lg relative">
              <ProductSearch />
            </div>
            <Button className="bg-gray-100 text-gray-800 shadow-lg font-semibold hover:bg-slate-200 hover:scale-[1.02] active:scale-[1]">
              ค้นหา
            </Button>
          </form>

          {!!itemList && itemList.length > 0 && (
            <>
              <div className="w-full h-[80vh] mt-6 overflow-auto">
                <ProductTable itemList={itemList} />
              </div>
              <ProductPagination totalFound={totalFound} />
            </>
          )}
        </div>

        <div>{!!itemList && itemList.length > 0 && <PosProductDetail />}</div>
      </SheetContent>
    </Sheet>
  );
}
