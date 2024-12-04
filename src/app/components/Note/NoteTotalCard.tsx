import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";
import { NoteContext, NoteContextType } from "./NoteProvider";

export default function NoteTotalCard() {
  const {
    noteBills,
    getSumBeforeTax,
    getSumAfterTax,
    getSumTax,
    getSumFullAmount,
    noteDiscount,
  } = useContext(NoteContext) as NoteContextType;

  return (
    <Card className="W-full shadow-md">
      <CardContent className="grid place-content-center gap-8 py-6 px-8">
        <div className="grid grid-cols-2 w-fit justify-end gap-4 rounded-lg">
          <span>จำนวนรายการ</span>
          <span className="text-right">
            {!!noteBills ? noteBills.length : 0}
          </span>
          <span>ราคาเต็มรวม</span>
          <span className="text-right">{getSumFullAmount()}</span>
          <span>ส่วนลดทั้งหมด</span>
          <span className="text-right">
            {noteDiscount !== ""
              ? parseFloat(noteDiscount).toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </span>
          {!!noteBills && (
            <>
              <Separator className="col-span-2" />
              <span>มูลค่ารวมก่อนภาษี</span>
              <span className="text-right">{getSumBeforeTax()}</span>
              <span>ภาษีมูลค่าเพิ่ม 7%</span>
              <span className="text-right">{getSumTax()}</span>
            </>
          )}
          <Separator className="col-span-2" />
          <span className="font-bold col-span-2">ยอดรวมทั้งหมด</span>
          <div className="rounded-md text-6xl py-2 px-4 bg-red-800 text-white font-semibold col-span-2 text-center">
            {getSumAfterTax()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
