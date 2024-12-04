import React from "react";

import { Input } from "@/components/ui/input";

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
import DateRange from "../Common/DateRange";

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
    คงค้าง: pathName === "/customer" ? "R" : "P",
  };

  return (
    <div className="flex gap-2 items-center justify-end">
      <div className="w-fit flex gap-2">
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
          className={`rounded-r-md w-56 ${
            currentTab === "bills" ? "rounded-l-none" : "rounded-l-md"
          }`}
          type="text"
          placeholder={
            filterPlaceholder[currentTab as keyof typeof filterPlaceholder]
          }
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        ></Input>

        <DateRange
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
      </div>
    </div>
  );
}
