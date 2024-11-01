import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { paymentFilterType } from "./PosRecentBillSheet";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type PosRecentBillFilterProps = {
  paymentFilter: paymentFilterType;
  handleFilterChange: (filter: paymentFilterType) => void;
  billDate: Date;
  setBillDate: (date: Date) => void;
};

export default function PosRecentBillFilter({
  paymentFilter,
  handleFilterChange,
  billDate,
  setBillDate,
}: PosRecentBillFilterProps) {
  const [popOpen, setPopOpen] = useState(false);
  const [togglePayValue, setTogglePayValue] = useState(
    "cash transfer credit check".split(" ")
  );
  const [toggleVatValue, setToggleVatValue] = useState("vat novat".split(" "));
  function handleClickDate(date: Date) {
    setBillDate(date);
    setPopOpen(false);
  }
  return (
    <>
      <div className="flex gap-4 justify-center items-baseline">
        <span>รายการบิลขายประจำวันที่</span>
        <Popover open={popOpen}>
          <PopoverTrigger
            onClick={() => setPopOpen((cur) => !cur)}
            className="py-1 px-2 rounded-md hover:bg-gray-200 text-xl font-semibold"
          >
            {billDate.toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </PopoverTrigger>
          <PopoverContent
            onFocusOutside={() => setPopOpen(false)}
            className="pointer-events-auto"
          >
            <Calendar
              mode="single"
              selected={billDate}
              onDayClick={(date) => handleClickDate(date)}
              defaultMonth={billDate}
              formatters={{
                formatCaption: (date) =>
                  date.toLocaleDateString("th-TH", {
                    month: "long",
                    year: "numeric",
                  }),
              }}
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <Input
          value={paymentFilter.filterText}
          placeholder="ชื่อลูกค้า หรือ เลขที่บิล"
          onChange={(e) =>
            handleFilterChange({
              ...paymentFilter,
              filterText: e.target.value,
            })
          }
          className="w-40 focus-visible:ring-transparent"
        />

        <ToggleGroup
          type="multiple"
          className="border-x px-2"
          value={togglePayValue}
          onValueChange={(values) => {
            setTogglePayValue(values);
            handleFilterChange({
              ...paymentFilter,
              cash: values.includes("cash") ? true : false,
              transfer: values.includes("transfer") ? true : false,
              credit: values.includes("credit") ? true : false,
              check: values.includes("check") ? true : false,
            });
          }}
        >
          <ToggleGroupItem value="cash">เงินสด</ToggleGroupItem>
          <ToggleGroupItem value="transfer">โอน</ToggleGroupItem>
          <ToggleGroupItem value="credit">ลงบัญชี</ToggleGroupItem>
          <ToggleGroupItem value="check">เช็ค</ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="multiple"
          value={toggleVatValue}
          onValueChange={(values) => {
            setToggleVatValue(values);
            handleFilterChange({
              ...paymentFilter,
              vat: values.includes("vat") ? true : false,
              novat: values.includes("novat") ? true : false,
            });
          }}
        >
          <ToggleGroupItem value="vat">VAT</ToggleGroupItem>
          <ToggleGroupItem value="novat">ไม่ VAT</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}
