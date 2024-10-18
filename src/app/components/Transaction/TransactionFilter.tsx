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
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

const filterPlaceholder = {
  allItems: "ชื่อ หรือ รหัสสินค้า...",
  bills: "เลขที่บิล...",
  notes: "เลขที่ใบวางบิล...",
  vouchers: "เลขที่ใบสำคัญ...",
};

export default function TransactionFilter() {
  const pathName = usePathname();

  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    filterText,
    setFilterText,
    currentTab,
    billType,
    setBillType,
  } = React.useContext(TransactionContext) as TransactionContextType;

  function handleClickBillType(type: string) {
    setBillType(type);
  }

  const billTypeName = {
    บิลทั่วไป: "1",
    ใบลดหนี้: "2",
    ใบเพิ่มหนี้: "3",
    คงค้าง: pathName === "/sales" ? "R" : "P",
  };

  return (
    <div className="flex gap-2 items-center justify-end">
      <div className="w-72 flex">
        {currentTab === "bills" && (
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-gray-300 py-1 px-2 rounded-l-md text-sm w-28">
              {Object.keys(billTypeName).filter(
                (key) =>
                  billTypeName[key as keyof typeof billTypeName] === billType
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(billTypeName).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() =>
                    handleClickBillType(
                      billTypeName[key as keyof typeof billTypeName]
                    )
                  }
                >
                  {key}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Input
          className={`rounded-r-md ${
            currentTab === "bills" ? "rounded-l-none" : "rounded-l-md"
          }`}
          type="text"
          placeholder={
            filterPlaceholder[currentTab as keyof typeof filterPlaceholder]
          }
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
  );
}
