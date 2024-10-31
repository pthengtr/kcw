import { Card, CardContent } from "@/components/ui/card";
import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import { Separator } from "@/components/ui/separator";
import PosBillTotalReturn from "./PosBillTotalReturn";

export default function PosBillTotalCard() {
  const {
    getSumAmount,
    getSumFullprice,
    getSumDiscount,
    getSumBeforeTax,
    getSumTax,
    vat,
    posItems,
    returnMode,
  } = useContext(PosContext) as PosContextType;
  return (
    <Card className="W-full shadow-md">
      <CardContent className="grid place-content-center gap-8 py-6 px-8">
        {returnMode ? (
          <PosBillTotalReturn />
        ) : (
          <div className="grid grid-cols-2 w-fit justify-end gap-4 rounded-lg">
            <span>จำนวนรายการ</span>
            <span className="text-right">
              {!!posItems ? posItems.length : 0}
            </span>
            <span>ราคาเต็ม</span>
            <span className="text-right">{getSumFullprice()}</span>
            <span>ส่วนลดทั้งหมด</span>
            <span className="text-right">{getSumDiscount()}</span>
            {vat === "vat" && !!posItems && (
              <>
                <Separator className="col-span-2" />
                <span>มูลค่ารวมก่อนภาษี</span>
                <span className="text-right">{getSumBeforeTax()}</span>
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span className="text-right">{getSumTax()}</span>
              </>
            )}
            <Separator className="col-span-2" />
            <span className="font-bold col-span-2">ยอดรวม</span>
            <div className="rounded-md text-6xl py-2 px-4 bg-primary text-white font-semibold col-span-2 text-center">
              {getSumAmount()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
