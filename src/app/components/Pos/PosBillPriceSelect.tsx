import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priceOptions = ["PRICE1", "PRICE2", "PRICE3", "PRICE4", "PRICE5"];

export default function PosBillPriceSelect() {
  function handlePriceChange() {}
  return (
    <Select defaultValue={`PRICE1`} onValueChange={handlePriceChange}>
      <SelectTrigger className="w-fit focus:ring-transparent">
        <SelectValue placeholder="เลือกราคา" />
      </SelectTrigger>
      <SelectContent>
        {priceOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
