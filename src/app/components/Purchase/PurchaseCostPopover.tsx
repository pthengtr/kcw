import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PosContext, PosContextType, posItemsType } from "../Pos/PosProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";

type PurchaseCostPopoverProps = {
  item: posItemsType;
};

export default function PurchaseCostPopover({
  item,
}: PurchaseCostPopoverProps) {
  const { posItems, setPosItems } = useContext(PosContext) as PosContextType;

  const [beforeVat, setBeforeVat] = useState<string>("");
  const [afterVat, setAfterVat] = useState<string>("");

  function handleChangeBeforeVat(value: string) {
    setBeforeVat(value);
    setAfterVat(
      (parseFloat(value) * 1.07).toLocaleString("th-TH", {
        useGrouping: false,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function handleChangeAfterVat(value: string) {
    setAfterVat(value);
    setBeforeVat(
      (parseFloat(value) / 1.07).toLocaleString("th-TH", {
        useGrouping: false,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function handlePopOverClose(open: boolean) {
    if (open || !posItems) return;

    const newPosItems = posItems.map((posItem) => {
      if (posItem.BCODE === item.BCODE)
        posItem.cost = parseFloat(afterVat === "" ? "0" : afterVat);
      return posItem;
    });

    setPosItems(newPosItems);
  }

  return (
    <Popover onOpenChange={handlePopOverClose}>
      <PopoverTrigger className="border p-2 rounded-md hover:bg-white">
        {item.cost.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-2 items-center gap-4 w-72">
        <Label htmlFor="before-vat" className="justify-self-end">
          ก่อนภาษี
        </Label>
        <Input
          type="number"
          id="before-vat"
          value={beforeVat}
          onChange={(e) => handleChangeBeforeVat(e.target.value)}
          className="text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
        />
        <Label htmlFor="after-vat" className="justify-self-end">
          รวมภาษี
        </Label>
        <Input
          type="number"
          id="after-vat"
          value={afterVat}
          onChange={(e) => handleChangeAfterVat(e.target.value)}
          className="text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
        />
      </PopoverContent>
    </Popover>
  );
}
