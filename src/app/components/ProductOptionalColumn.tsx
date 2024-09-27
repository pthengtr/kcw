"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const columnName: Record<string, string> = {
  ACODE: "ชื่อย่อ",
  XCODE: "กลุ่ม",
  MCODE: "เบอร์โรงงาน",
  PCODE: "เบอร์แท้",
  BRAND: "ยี่ห้อ",
  VENDOR: "บริษัท",
  PRICENET1: "ราคา",
  LOCATION1: "ที่เก็บ",
  SIZE1: "ขนาด1",
  SIZE2: "ขนาด2",
  SIZE3: "ขนาด3",
};

type ProductOptionalColumnProps = {
  column: string;
  setColumn: (column: string) => void;
  handleSort: (sortKey: string) => void;
};

export default function ProductOptionalColumn({
  column,
  setColumn,
  handleSort,
}: ProductOptionalColumnProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex gap-2 items-center justify-center">
          <span>{columnName[column]}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSort(column)}>
          <span>เรียงลำดับ</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3 ml-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
          </svg>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.keys(columnName).map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setColumn(key)}
            className={key === column ? "font-bold" : undefined}
          >
            {columnName[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
