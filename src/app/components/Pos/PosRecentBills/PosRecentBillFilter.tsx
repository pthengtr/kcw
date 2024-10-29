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
      <div className="flex gap-4 items-center justify-center">
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
        <div className="flex gap-2 items-center">
          <Checkbox
            className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
            checked={paymentFilter.cash}
            onCheckedChange={() =>
              handleFilterChange({
                ...paymentFilter,
                cash: !paymentFilter.cash,
              })
            }
            id="cash"
          />
          <label htmlFor="cash">เงินสด</label>
        </div>
        <div className="flex gap-2 items-center">
          <Checkbox
            className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
            checked={paymentFilter.transfer}
            onCheckedChange={() =>
              handleFilterChange({
                ...paymentFilter,
                transfer: !paymentFilter.transfer,
              })
            }
            id="transfer"
          />
          <label htmlFor="transfer">โอน</label>
        </div>
        <div className="flex gap-2 items-center">
          <Checkbox
            className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
            checked={paymentFilter.credit}
            onCheckedChange={() =>
              handleFilterChange({
                ...paymentFilter,
                credit: !paymentFilter.credit,
              })
            }
            id="credit"
          />
          <label htmlFor="check">ลงบัญชี</label>
        </div>
        <div className="flex gap-2 items-center">
          <Checkbox
            className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
            checked={paymentFilter.check}
            onCheckedChange={() =>
              handleFilterChange({
                ...paymentFilter,
                check: !paymentFilter.check,
              })
            }
            id="check"
          />
          <label htmlFor="check">เช็ค</label>
        </div>
      </div>
    </>
  );
}
