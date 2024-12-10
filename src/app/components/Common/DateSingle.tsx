import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type DateSingleProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export default function DateSingle({ date, setDate }: DateSingleProps) {
  return (
    <Popover>
      <PopoverTrigger className="py-1 px-2 rounded-md bg-gray-100 hover:bg-gray-200 text-base">
        {date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "narrow",
          year: "numeric",
        })}
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto">
        <Calendar
          mode="single"
          selected={date}
          onDayClick={(_date) => setDate(_date)}
          defaultMonth={date}
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
  );
}
