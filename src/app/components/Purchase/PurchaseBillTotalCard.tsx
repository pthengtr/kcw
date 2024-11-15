import { Card, CardContent } from "@/components/ui/card";
import { useContext } from "react";
import { PosContext, PosContextType } from "../Pos/PosProvider";
import { Separator } from "@/components/ui/separator";
import { PurchaseContext, PurchaseContextType } from "./PurchaseProvider";

export default function PurchaseBillTotalCard() {
  const { vat, posItems } = useContext(PosContext) as PosContextType;

  const {
    getTotalCostBeforeVat,
    getTotalCostAfterVat,
    getTotalFullCostBeforeVat,
    getTotalDiscount,
    getTotalTax,
  } = useContext(PurchaseContext) as PurchaseContextType;

  return (
    <Card className="W-full shadow-md">
      <CardContent className="grid place-content-center gap-8 py-6 px-8">
        <div className="grid grid-cols-2 w-fit justify-end gap-4 rounded-lg">
          <span>จำนวนรายการ</span>
          <span className="text-right">{!!posItems ? posItems.length : 0}</span>
          <span>ราคาเต็ม</span>
          <span className="text-right">{getTotalFullCostBeforeVat()}</span>
          <span>ส่วนลดทั้งหมด</span>
          <span className="text-right">{getTotalDiscount()}</span>
          {vat === "vat" && !!posItems && (
            <>
              <Separator className="col-span-2" />
              <span>มูลค่ารวมก่อนภาษี</span>
              <span className="text-right">{getTotalCostBeforeVat()}</span>
              <span>ภาษีมูลค่าเพิ่ม 7%</span>
              <span className="text-right">{getTotalTax()}</span>
            </>
          )}
          <Separator className="col-span-2" />
          <span className="font-bold col-span-2">ยอดรวม</span>
          <div className="rounded-md text-6xl py-2 px-4 bg-red-800 text-white font-semibold col-span-2 text-center">
            {getTotalCostAfterVat()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
