import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import PosProductSheet from "../Pos/PosProductSheet";
import { Separator } from "@/components/ui/separator";
import PurchaseBillItemsTable from "./PurchaseBillItemsTable";
import PurchaseDiscountPopover from "./PurchaseDiscountPopover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { PosContext, PosContextType } from "../Pos/PosProvider";
import PosSelectAcount from "../Pos/PosSelectAccount";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { PurchaseContext, PurchaseContextType } from "./PurchaseProvider";

export default function PurchaseBillItemsCard() {
  const { data: session } = useSession();
  const { vat, setVat, payment, setPayment } = useContext(
    PosContext
  ) as PosContextType;

  const {
    purchaseBillNo,
    setPurchaseBillNo,
    purchaseBillDate,
    setPurchaseBillDate,
  } = useContext(PurchaseContext) as PurchaseContextType;

  return (
    <Card className="w-full pb-8 shadow-md flex flex-col">
      <CardHeader className="h-[22%]">
        <CardTitle className="flex flex-col gap-4">
          <div className="flex justify-between">
            <PosSelectAcount />
            <span className="font-normal text-base italic">
              {session?.user?.name}
            </span>
          </div>

          <Separator />
          <div className="text-center items-center flex">
            <div className="flex-1 text-left flex gap-2">
              <PosProductSheet />
            </div>
            <div className="flex gap-2">
              <Input
                id="before-vat"
                value={purchaseBillNo}
                onChange={(e) => setPurchaseBillNo(e.target.value)}
                placeholder="เลขที่บิลซื้อ"
                className="focus-visible:ring-transparent"
              />
            </div>
            <div className="flex-1 flex justify-end">
              <Popover>
                <PopoverTrigger className="py-1 px-2 rounded-md hover:bg-gray-200 text-base">
                  {purchaseBillDate.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </PopoverTrigger>
                <PopoverContent className="pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={purchaseBillDate}
                    onDayClick={(date) => setPurchaseBillDate(date)}
                    defaultMonth={purchaseBillDate}
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
        <PurchaseBillItemsTable />
        <Separator />
        <div className="flex gap-4 justify-center mt-4">
          <div className="flex gap-2 items-center">
            <span>ส่วนลด</span>
            <PurchaseDiscountPopover mode="bill" />
          </div>

          <Tabs
            value={vat}
            onValueChange={setVat}
            className="col-span-2 bg-gray-100 rounded-md"
          >
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="novat">
                บิลทั่วไป
              </TabsTrigger>
              <TabsTrigger className="w-full" value="vat">
                บิล VAT
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            value={payment}
            onValueChange={setPayment}
            className="col-span-2 bg-gray-100 rounded-md"
          >
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="CASH">
                เงินสด
              </TabsTrigger>
              <TabsTrigger className="w-full " value="CREDIT">
                ลงบัญชี
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
