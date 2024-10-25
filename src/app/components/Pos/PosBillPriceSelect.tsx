import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PosContext, PosContextType, priceName } from "./PosProvider";
import { useContext } from "react";

const priceOptions = ["PRICE1", "PRICE2", "PRICE3", "PRICE5"];

export default function PosBillPriceSelect() {
  const { posItems, setPosItems } = useContext(PosContext) as PosContextType;

  function handlePriceChange(value: string) {
    const newPosItems =
      posItems &&
      posItems.map((item) => {
        const prices = Object.fromEntries(
          item.prices.map((price) => [price.Attribute, price.Value])
        );
        const prices_m = Object.fromEntries(
          item.prices_m.map((price) => [price.Attribute, price.Value])
        );
        const itemPrice = item.atUnit === "UI1" ? prices : prices_m;
        item.atPrice = Object.keys(itemPrice).includes(value)
          ? value
          : "PRICE1";

        return item;
      });

    if (!!newPosItems) setPosItems(newPosItems);
  }
  return (
    <Select defaultValue={`PRICE1`} onValueChange={handlePriceChange}>
      <SelectTrigger className="w-fit focus:ring-transparent">
        <SelectValue placeholder="เลือกราคา" />
      </SelectTrigger>
      <SelectContent>
        {priceOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {priceName[option as keyof typeof priceName]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
