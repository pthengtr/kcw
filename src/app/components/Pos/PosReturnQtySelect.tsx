import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { PosContext, PosContextType, posItemsType } from "./PosProvider";

type PosReturnQtySelectProps = {
  item: posItemsType;
};

export default function PosReturnQtySelect({ item }: PosReturnQtySelectProps) {
  const { setPosItems, posItems } = useContext(PosContext) as PosContextType;

  const qtyArray = Array.from(
    Array(item.returnQty)
      .keys()
      .map((key) => key + 1)
  );

  function handleQtyChange(value: string) {
    const newPosItems = posItems?.map((posItem) => {
      if (posItem.BCODE === item.BCODE) posItem.QTY = parseInt(value);
      return posItem;
    });

    setPosItems(newPosItems);
  }

  return (
    <Select value={item.QTY.toString()} onValueChange={handleQtyChange}>
      <SelectTrigger className="w-14 focus:ring-transparent">
        <SelectValue placeholder="เลือกจำนวน" />
      </SelectTrigger>
      <SelectContent>
        {qtyArray.map((qty) => (
          <SelectItem className="" key={qty} value={qty.toString()}>
            {qty}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
