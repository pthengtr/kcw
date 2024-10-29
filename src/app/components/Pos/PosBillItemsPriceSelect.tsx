import {
  PosContext,
  PosContextType,
  posItemsType,
  priceName,
} from "./PosProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const defaultPrice = "PRICE1";

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
      {/* <Select defaultValue={defaultPrice} onValueChange={handlePriceChange}>
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
      </Select> */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex gap-1">
            <span>
              {getVatPrice(
                itemPrices[defaultPrice] - itemPrices[posItem.atPrice]
              )}
            </span>
            <span>
              ({priceName[posItem.atPrice as keyof typeof priceName]})
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.keys(itemPrices).map((key) => (
            <DropdownMenuItem key={key} onClick={() => handlePriceChange(key)}>
              <div className="flex gap-1">
                <span>
                  {getVatPrice(itemPrices[defaultPrice] - itemPrices[key])}
                </span>
                <span>({priceName[key as keyof typeof priceName]})</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
