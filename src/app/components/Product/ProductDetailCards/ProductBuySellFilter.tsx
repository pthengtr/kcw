import React from "react";
import { th } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductBuySellFilterProps = {
  filterText: string;
  setFilterText: (text: string) => void;
  fromDate: Date;
  setFromDate: (date: Date) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
};

export default function ProductBuySellFilter({
  filterText,
  setFilterText,
  toDate,
  setToDate,
  fromDate,
  setFromDate,
}: ProductBuySellFilterProps) {
  return (
    <>
      <div className="flex gap-2 items-center justify-end">
        <div className="w-48">
          <Input
            className="roundeก-md"
            type="text"
            placeholder="รหัส หรือ ชื่อ..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          ></Input>
        </div>

        <Popover>
          <PopoverTrigger className="bg-gray-300 w-48 rounded-md text-sm py-2">
            {fromDate && toDate ? (
              `${fromDate.toLocaleDateString(
                "th-TH"
              )} - ${toDate.toLocaleDateString("th-TH")} `
            ) : (
              <span>เลือกวันที่...</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="bg-white z-10 shadow-lg rounded-md">
            <Tabs defaultValue="from">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="from">
                  ตั้งแต่
                </TabsTrigger>
                <TabsTrigger className="w-full" value="to">
                  ถึง
                </TabsTrigger>
              </TabsList>
              <TabsContent value="from">
                <Calendar
                  mode="single"
                  locale={th}
                  selected={fromDate}
                  onDayClick={setFromDate}
                  defaultMonth={fromDate}
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
              </TabsContent>
              <TabsContent value="to">
                <Calendar
                  mode="single"
                  locale={th}
                  selected={toDate}
                  onDayClick={setToDate}
                  defaultMonth={toDate}
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
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
