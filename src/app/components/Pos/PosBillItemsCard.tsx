import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTable from "@/app/components/Product/ProductTable";
import ProductPagination from "@/app/components/Product/ProductPagination";
import ProductSearch from "../Product/ProductSearch";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import { SearchContext, SearchContextType } from "../SearchProvider";

import PosProductDetail from "./PosProductDetail";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useSession } from "next-auth/react";
import PosSelectAcount from "./PosSelectAccount";

export default function PosBillItemsCard() {
  const {
    posItems,
    handleCLickDeleteItem,
    handleClickRemoveQty,
    handleClickAddQty,
    getSumAmount,
    vat,
  } = useContext(PosContext) as PosContextType;
  const { itemList, totalFound, handleSubmitForm } = useContext(
    SearchContext
  ) as SearchContextType;

  const { data: session } = useSession();

  return (
    <Card className="w-full pb-8 shadow-md">
      <CardHeader>
        <CardTitle className="text-center items-center flex">
          <div className="flex-1 text-left">
            <Sheet>
              <SheetTrigger className="bg-gray-100 text-base p-2 rounded-md hover:bg-gray-200">
                ค้นหาสินค้า
              </SheetTrigger>
              <SheetContent
                side="left"
                className="sm:max-w-[70%] overflow-auto"
              >
                <SheetHeader>
                  <SheetTitle className="w-[500px] mx-auto">
                    <form
                      onSubmit={handleSubmitForm}
                      className="flex gap-2 items-center"
                    >
                      <div className="w-[500px] flex flex-auto shadow-lg relative">
                        <ProductSearch />
                      </div>
                      <Button className="bg-gray-100 text-gray-800 shadow-lg font-semibold hover:bg-slate-200 hover:scale-[1.02] active:scale-[1]">
                        ค้นหา
                      </Button>
                    </form>
                  </SheetTitle>
                  <SheetDescription>
                    {!!itemList && itemList.length > 0 && (
                      <>
                        <div className="w-full h-[40vh] overflow-auto">
                          <ProductTable itemList={itemList} />
                        </div>
                        <ProductPagination totalFound={totalFound} />
                        <PosProductDetail />
                      </>
                    )}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <span>รายการสินค้า</span>
          <div className="flex-1 text-base flex flex-col justify-end text-right gap-2">
            <PosSelectAcount />
            <span className="font-normal italic">{session?.user?.name}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[70vh]">
        <div className="overflow-auto">
          <Table className="h-full relative">
            <TableHeader className="sticky top-0  bg-white">
              <TableRow>
                <TableHead>รหัสสินค้า</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>{/*place holder for - button */}</TableHead>
                <TableHead>จำนวน</TableHead>
                <TableHead>{/*place holder for + button */}</TableHead>
                <TableHead>หน่วย</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>{/*place holder for delete button */}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!!posItems &&
                posItems.map((item) => (
                  <TableRow key={item.BCODE}>
                    <TableCell>{item.BCODE}</TableCell>
                    <TableCell>{item.DESCR}</TableCell>
                    <TableCell
                      onClick={() => handleClickRemoveQty(item.BCODE)}
                      className="text-gray-300 hover:cursor-pointer hover:text-gray-500"
                    >
                      <RemoveIcon />
                    </TableCell>
                    <TableCell className="text-center">{item.QTY}</TableCell>
                    <TableCell
                      onClick={() => handleClickAddQty(item.BCODE)}
                      className="text-gray-300 hover:cursor-pointer hover:text-gray-500"
                    >
                      <AddIcon />
                    </TableCell>
                    <TableCell>{item.UI}</TableCell>
                    <TableCell className="text-right">
                      {(vat === "vat"
                        ? item.ISVAT === "Y"
                          ? (item.PRICE * 100) / 107
                          : item.PRICE
                        : item.PRICE
                      ).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {(vat === "vat"
                        ? item.ISVAT === "Y"
                          ? (item.PRICE * item.QTY * 100) / 107
                          : item.PRICE * item.QTY
                        : item.PRICE * item.QTY
                      ).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      onClick={() => handleCLickDeleteItem(item.BCODE)}
                      className="text-gray-300 hover:cursor-pointer hover:text-gray-500"
                    >
                      <TrashIcon />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {vat === "vat" && !!posItems && (
          <div className="flex justify-end text-base mt-8 h-fit">
            <div className="grid grid-cols-2 w-fit justify-end gap-4 border p-4 rounded-lg">
              <span>มูลค่ารวมก่อนภาษี</span>
              <span className="text-right">
                {(getSumAmount() * (100 / 107)).toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span>ภาษีมูลค่าเพิ่ม 7%</span>
              <span className="text-right">
                {(getSumAmount() * (1 - 100 / 107)).toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="font-bold">ยอดรวม</span>
              <span className="font-bold text-right">
                {getSumAmount().toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentcolor"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentcolor"
    >
      <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentcolor"
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
}
