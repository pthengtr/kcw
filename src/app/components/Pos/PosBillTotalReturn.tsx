import { PosContext, PosContextType } from "./PosProvider";
import { useContext } from "react";
import { Separator } from "@/components/ui/separator";

export default function PosBillTotalReturn() {
  const { getSumReturnAmount, posItems, currentReturnBill } = useContext(
    PosContext
  ) as PosContextType;

  return (
    <div className="grid grid-cols-2 w-fit justify-end items-center gap-4 rounded-lg">
      <span>อ้างอิงจาก</span>
      <span className="text-right">{currentReturnBill?.BILLNO}</span>
      <Separator className="col-span-2" />
      <span>จำนวนรายการอ้างอิง</span>
      <span className="text-right">{!!posItems ? posItems.length : 0}</span>
      <span>มูลค่ารวมก่อนภาษี</span>
      <span className="text-right">
        {currentReturnBill?.BEFORETAX.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span>ภาษีมูลค่าเพิ่ม 7%</span>
      <span className="text-right">
        {currentReturnBill?.TAX.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className="font-bold">ยอดรวมอ้างอิง</span>
      <span className="text-right font-bold">
        {currentReturnBill?.AFTERTAX.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <Separator className="col-span-2" />
      <span>จำนวนรายการที่คืน</span>
      <span className="text-right">
        {!!posItems
          ? posItems.reduce((acc, cur) => (cur.isReturn ? acc + 1 : acc), 0)
          : 0}
      </span>
      <span className="font-bold text-2xl">ยอดรวมคืน</span>
      <span className="text-right font-bold text-2xl bg-primary rounded-md w-fit justify-self-end text-white px-2 py-1">
        {getSumReturnAmount()}
      </span>
    </div>
  );
}
