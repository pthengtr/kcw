import { PosContext, PosContextType } from "./PosProvider";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";

export default function PosBillSaveDialogTransfer() {
  const [transactionNumber, setTransactionNumber] = useState("");
  const { getSumAmount, posItems } = useContext(PosContext) as PosContextType;

  const sumAmount = getSumAmount();
  return (
    <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-xl items-baseline text-right p-6 border rounded-lg">
      <span>จำนวนรายการ</span>
      <span className="text-right">{!!posItems ? posItems.length : 0}</span>

      <span className="text-right">ยอดรวม</span>
      <span className="font-semibold text-2xl bg-primary text-white rounded.md px-1 justify-self-end rounded-sm">
        {sumAmount}
      </span>

      <span className="text-right">เลข 4 ตัวท้ายในสลิป</span>
      <span className="flex justify-end">
        <Input
          value={transactionNumber}
          type="number"
          onChange={(e) => setTransactionNumber(e.target.value)}
          className="w-48 text-right text-2xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </span>
    </div>
  );
}
