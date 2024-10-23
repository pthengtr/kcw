import { useContext } from "react";
import { PosContext, PosContextType, posItemsType } from "./PosProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PosBillItemsUnitSelectProps = {
  posItem: posItemsType;
};
export default function PosBillItemsUnitSelect({
  posItem,
}: PosBillItemsUnitSelectProps) {
  const { posItems, setPosItems } = useContext(PosContext) as PosContextType;

  function handleUnitChange(value: string) {
    const newPosItems = posItems?.map((item) => {
      if (item.BCODE === posItem.BCODE) {
        item.atUnit = value;
        item.atPrice = value === "UI1" ? "PRICE1" : "PRICEM1";
      }
      return item;
    });

    setPosItems(newPosItems);
  }

  return (
    <Select defaultValue="UI1" onValueChange={handleUnitChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="เลือกหน่วย" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="UI1">{posItem.UI1}</SelectItem>
        {!!posItem.UI2 && <SelectItem value="UI2">{posItem.UI2}</SelectItem>}
      </SelectContent>
    </Select>
  );
}
