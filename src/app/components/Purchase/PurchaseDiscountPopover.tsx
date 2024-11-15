import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PosContext, PosContextType, posItemsType } from "../Pos/PosProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";

type PurchaseDiscountPopoverProps = {
  item?: posItemsType;
  mode: "item" | "bill";
};

export default function PurchaseDiscountPopover({
  item,
  mode,
}: PurchaseDiscountPopoverProps) {
  const { posItems, setPosItems } = useContext(PosContext) as PosContextType;

  const [discount1, setDiscount1] = useState<string>("0");
  const [discount2, setDiscount2] = useState<string>("0");
  const [discount3, setDiscount3] = useState<string>("0");
  const [discount4, setDiscount4] = useState<string>("0");

  const itemDiscounts = item
    ? [item.DISCNT1, item.DISCNT2, item.DISCNT3, item.DISCNT4]
    : [
        parseFloat(discount1),
        parseFloat(discount2),
        parseFloat(discount3),
        parseFloat(discount4),
      ];

  useEffect(() => {
    if (!!item) {
      setDiscount1(item.DISCNT1 === null ? "0" : item.DISCNT1.toString());
      setDiscount2(item.DISCNT2 === null ? "0" : item.DISCNT2.toString());
      setDiscount3(item.DISCNT3 === null ? "0" : item.DISCNT3.toString());
      setDiscount4(item.DISCNT4 === null ? "0" : item.DISCNT4.toString());
    }
  }, [item, item?.DISCNT1, item?.DISCNT2, item?.DISCNT3, item?.DISCNT4]);

  function handlePopOverClose(open: boolean) {
    if (open || !posItems) return;

    const newPosItems = posItems.map((posItem) => {
      if (mode === "bill" || posItem.BCODE === item?.BCODE) {
        posItem.DISCNT1 = parseFloat(discount1);
        posItem.DISCNT2 = parseFloat(discount2);
        posItem.DISCNT3 = parseFloat(discount3);
        posItem.DISCNT4 = parseFloat(discount4);
      }
      return posItem;
    });

    setPosItems(newPosItems);
  }

  function totalDiscount(discnts: number[]) {
    return (
      (1 - discnts.reduce((acc, discnt) => ((100 - discnt) / 100) * acc, 1)) *
      100
    );
  }

  return (
    <Popover onOpenChange={handlePopOverClose}>
      <PopoverTrigger className="border p-2 rounded-md hover:bg-white">
        {totalDiscount(itemDiscounts).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-2 items-center gap-4 w-72">
        <Label htmlFor="discount1" className="justify-self-end">
          ส่วนลด 1
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            id="discount1"
            value={discount1}
            onChange={(e) => setDiscount1(e.target.value)}
            className="text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
          />
          <span>%</span>
        </div>

        <Label htmlFor="discount2" className="justify-self-end">
          ส่วนลด 2
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            id="discount2"
            value={discount2}
            onChange={(e) => setDiscount2(e.target.value)}
            className="text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
          />
          <span>%</span>
        </div>

        <Label htmlFor="discount3" className="justify-self-end">
          ส่วนลด 3
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            id="discount3"
            value={discount3}
            onChange={(e) => setDiscount3(e.target.value)}
            className="text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
          />
          <span>%</span>
        </div>

        <Label htmlFor="discount4" className="justify-self-end">
          ส่วนลด 4
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            id="discount4"
            value={discount4}
            onChange={(e) => setDiscount4(e.target.value)}
            className="text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
          />
          <span>%</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
