import React, { useState } from "react";
import { th } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

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
        <PopoverTrigger className="bg-gray-300 py-1 w-24 rounded-md text-sm">
          {fromDate ? (
            fromDate.toLocaleDateString("th-TH")
          ) : (
            <span>เลือกวันที่...</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="bg-white z-10 shadow-lg rounded-md">
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
            classNames={{
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger className="bg-gray-300 py-1 w-24 rounded-md text-sm">
          {toDate ? (
            toDate.toLocaleDateString("th-TH")
          ) : (
            <span>เลือกวันที่...</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="bg-white z-10 shadow-lg rounded-md">
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

// function FilterSVG() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       height="24px"
//       viewBox="0 -960 960 960"
//       width="24px"
//       fill="#5f6368"
//     >
//       <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
//     </svg>
//   );
// }

// function CalendarFromSVG() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       height="24px"
//       viewBox="0 -960 960 960"
//       width="24px"
//       fill="#5f6368"
//     >
//       <path d="M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z" />
//     </svg>
//   );
// }

// function CalendarToSVG() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       height="24px"
//       viewBox="0 -960 960 960"
//       width="24px"
//       fill="#5f6368"
//     >
//       <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
//     </svg>
//   );
// }
