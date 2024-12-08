import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import BillSheet from "./BillSheet";
import { useContext } from "react";
import { billType } from "../Transaction/TransactionProvider";
import BillsTable from "../Common/BillsTable";
import NoteDetailDialog from "./NoteDetailDialog";
import { supabase } from "@/app/lib/supabase";
import { NoteContext, NoteContextType } from "./NoteProvider";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import NoteSelectAcount from "./NoteSelectAccount";

export default function NoteBillsCard() {
  const {
    noteBills,
    noteDate,
    setNoteDate,
    setCurrentBill,
    setCurrentBillItems,
    setNoteDetailOpen,
    purchaseNoteNo,
    setPurchaseNoteNo,
    noteDiscount,
    setNoteDiscount,
    currentAccount,
  } = useContext(NoteContext) as NoteContextType;
  const { data: session } = useSession();
  const pathName = usePathname();

  async function getCurrentBillItemsSupabase(bill: billType) {
    const { data, error } = await supabase
      .from("items")
      .select(`*, products(*)`)
      .eq("BILLNO", bill.BILLNO)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) {
      setCurrentBill(bill);
      setCurrentBillItems(data);
      setNoteDetailOpen(true);
    }
  }

  function handleClickNoteBill(bill: billType) {
    getCurrentBillItemsSupabase(bill);
  }

  return (
    <Card className="w-full pb-8 shadow-md flex flex-col">
      <CardHeader className="h-[22%]">
        <CardTitle className="flex flex-col gap-4">
          <div className="flex justify-between">
            <NoteSelectAcount />
            <span></span>
            <span className="font-normal text-base italic">
              {session?.user?.name}
            </span>
          </div>

          <Separator />
          <div className="text-center items-center flex">
            <div className="flex-1 text-left flex gap-2">
              {!!currentAccount && <BillSheet />}
            </div>
            {pathName === "/sale-note" ? (
              <div className="flex gap-2">ใบวางบิลลูกหนี้</div>
            ) : (
              <Input
                className="w-72"
                placeholder="เลขที่ใบวางบิลเจ้าหนี้..."
                value={purchaseNoteNo}
                onChange={(e) => setPurchaseNoteNo(e.target.value)}
              ></Input>
            )}
            <div className="flex-1 flex justify-end">
              <Popover>
                <PopoverTrigger className="py-1 px-2 rounded-md hover:bg-gray-200 text-base">
                  {noteDate.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </PopoverTrigger>
                <PopoverContent className="pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={noteDate}
                    onDayClick={(date) => setNoteDate(date)}
                    defaultMonth={noteDate}
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[78%] flex flex-col">
        {!!noteBills && (
          <div className="overflow-auto">
            <BillsTable
              bills={noteBills}
              currentBill={undefined}
              handleClickBill={handleClickNoteBill}
            />
          </div>
        )}

        <Separator />

        <div className="flex gap-4 justify-end items-center mt-4 mx-8">
          <span>ส่วนลด</span>
          <Input
            type="number"
            value={noteDiscount}
            onChange={(e) => setNoteDiscount(e.target.value)}
            className="w-20 text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
          />
        </div>

        <NoteDetailDialog />
      </CardContent>
    </Card>
  );
}
