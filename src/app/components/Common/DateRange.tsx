import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { th } from "date-fns/locale";

type DateRangeProps = {
  fromDate: Date;
  setFromDate: (date: Date) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
};

export default function DateRange({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}: DateRangeProps) {
  return (
    <Popover>
      <PopoverTrigger className="bg-gray-300 min-w-fit rounded-md text-sm p-2">
        {fromDate && toDate ? (
          `${fromDate.toLocaleDateString(
            "th-TH"
          )} - ${toDate.toLocaleDateString("th-TH")} `
        ) : (
          <span>เลือกวันที่...</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="bg-white z-50 shadow-lg rounded-md pointer-events-auto">
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
  );
}
