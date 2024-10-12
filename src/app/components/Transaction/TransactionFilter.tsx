import React, { useState } from "react";
import { th } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function createLastYearDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

export default function TransactionFilter() {
  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(
    createLastYearDate()
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex gap-2 items-center justify-end">
      <div className="w-64">
        <Input
          className="roundeก-md"
          type="text"
          placeholder="กรองผลการค้นหา..."
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
                onSelect={setFromDate}
                formatters={{
                  formatCaption: (date) =>
                    date.toLocaleDateString("th-TH", {
                      month: "long",
                      year: "numeric",
                    }),
                }}
                toYear={fromDate?.getFullYear()}
                toMonth={fromDate}
                toDate={fromDate}
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
                onSelect={setToDate}
                formatters={{
                  formatCaption: (date) =>
                    date.toLocaleDateString("th-TH", {
                      month: "long",
                      year: "numeric",
                    }),
                }}
                toYear={toDate?.getFullYear()}
                toMonth={toDate}
                toDate={toDate}
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
  );
}
