import { PosContext, PosContextType, posItemsType } from "./PosProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";

type PPosBillItemsPriceSelectProps = {
  posItem: posItemsType;
};
export default function PosBillItemsPriceSelect({
  posItem,
}: PPosBillItemsPriceSelectProps) {
  const { setPosItems, posItems, vat } = useContext(
    PosContext
  ) as PosContextType;

  function handlePriceChange(value: string) {
    const newPosItems = posItems?.map((item) => {
      if (item.BCODE === posItem.BCODE) item.atPrice = value;
      return item;
    });

    setPosItems(newPosItems);
  }

  const itemPrices =
    posItem.atUnit === "UI1"
      ? Object.fromEntries(
          posItem.prices.map((price) => [price.Attribute, price.Value])
        )
      : Object.fromEntries(
          posItem.prices_m.map((price) => [price.Attribute, price.Value])
        );

  const defaultPrice = posItem.atUnit === "UI1" ? "PRICE1" : "PRICEM1";

  function getVatPrice(price: number) {
    return (
      vat === "vat" ? (posItem.ISVAT === "Y" ? price : price * 1.07) : price
    ).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Select defaultValue={defaultPrice} onValueChange={handlePriceChange}>
        <SelectTrigger className="focus:ring-transparent w-full">
          <SelectValue placeholder="เลือกราคา">
            {getVatPrice(
              itemPrices[defaultPrice] - itemPrices[posItem.atPrice]
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.keys(itemPrices).map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
