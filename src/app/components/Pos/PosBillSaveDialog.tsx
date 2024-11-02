import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PosContext, PosContextType } from "./PosProvider";
import { useContext, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import PosBillTotalCard from "./PosBillTotalCard";
import PosBillSaveDialogCash from "./PosBillSaveDialogCash";
import PosBillSaveDialogTransfer from "./PosBillSaveDialogTransfer";
import { supabase } from "@/app/lib/supabase";

export default function PosBillSaveDialog() {
  const { payment, currentCustomer, vat, returnMode } = useContext(
    PosContext
  ) as PosContextType;

  const [billCount, setBillCount] = useState(0);

  console.log(billCount);

  async function getVatBillCount(year: string, month: string) {
    const { data, error, count } = await supabase
      .from("bills")
      .select(`*`, { count: "exact" })
      .neq("TAX", `0`)
      .ilike("BILLTYPE", `%S%`)
      .lt(
        "BILLDATE",
        new Date(`${year}-${month}-01 00:00`).toLocaleDateString("en-US")
      )
      .gte(
        "BILLDATE",
        new Date(`${year}-${month}-01 00:00`).toLocaleDateString("en-US")
      )
      .order("BILLDATE", { ascending: false })
      .limit(1);

    console.log(data);
    console.log(count);

    if (error) return;
    if (count !== null) setBillCount(count);
  }

  function handleConfirmBill() {
    const date = new Date();

    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString();

    console.log(year, month);

    getVatBillCount(year, month);
  }

  return (
    <Dialog>
      <DialogTrigger className="bg-secondary hover:bg-red-700 text-4xl py-10 shadow-md text-white rounded-md">
        {payment === "CASH" ? "ชำระเงิน" : "บันทึก"}
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-fit">
        <DialogHeader className="p-4">
          <DialogTitle className="text-3xl flex flex-col gap-4">
            {returnMode ? (
              <span>ใบลดหนี้</span>
            ) : (
              <div className="flex gap-2 items-center">
                {vat === "vat" && <span>ใบกำกับภาษี/</span>}
                <span>
                  {payment === "CASH" ? "ใบเสร็จรับเงิน" : "ใบส่งสินค้า"}
                </span>
              </div>
            )}

            <div className="text-xl flex gap-2 items-center">
              <span className="bg-green-700 rounded-md text-white px-1">
                {currentCustomer?.ACCTNO}
              </span>
              <span>{currentCustomer?.ACCTNAME}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        {payment === "CASH" && (
          <section className="w-[680px]">
            {returnMode ? (
              <PosBillTotalCard />
            ) : (
              <Tabs>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cash">เงินสด</TabsTrigger>
                  <TabsTrigger value="transfer">โอน</TabsTrigger>
                </TabsList>
                <TabsContent value="cash">
                  <PosBillSaveDialogCash />
                </TabsContent>
                <TabsContent value="transfer">
                  <PosBillSaveDialogTransfer />
                </TabsContent>
              </Tabs>
            )}
          </section>
        )}

        {payment === "CREDIT" && (
          <section className="w-[680px]">
            <PosBillTotalCard />
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          <DialogClose className="bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 p-2 rounded-lg">
            ยกเลิก
          </DialogClose>
          <Button
            onClick={handleConfirmBill}
            className="bg-secondary hover:bg-red-700 font-bold text-xl p-2"
          >
            ยืนยัน
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
