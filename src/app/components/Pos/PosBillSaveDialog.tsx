import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PosContext, PosContextType } from "./PosProvider";
import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import PosBillTotalCard from "./PosBillTotalCard";
import PosBillSaveDialogCash from "./PosBillSaveDialogCash";
import PosBillSaveDialogTransfer from "./PosBillSaveDialogTransfer";
import { supabase } from "@/app/lib/supabase";
import { billType } from "../Transaction/TransactionProvider";

export default function PosBillSaveDialog() {
  const { payment, currentCustomer, vat, returnMode } = useContext(
    PosContext
  ) as PosContextType;

  function formatNewBill(date: Date, data: billType[]) {
    let billHeader, newBillType;
    if (vat === "vat") {
      if (payment === "CASH") {
        billHeader = "RT";
        newBillType = "1SY";
      } else if (payment === "CREDIT") {
        billHeader = "IVT";
        newBillType = "1SN";
      }
    } else if (vat === "novat") {
      billHeader = "NOVAT";
    }

    const newBillId = Math.random().toString().substring(2, 14);

    const sequenceNumber =
      data.length === 0
        ? "0001"
        : (parseInt(data[0].BILLNO.split("-")[1]) + 1)
            .toString()
            .padStart(4, "0");

    const newBillNo =
      billHeader +
      date
        .toLocaleDateString("th-TH", { month: "2-digit", year: "2-digit" })
        .split("/")
        .reverse()
        .join("") +
      "-" +
      sequenceNumber;

    const newBill = {
      billId: newBillId,
      BILLNO: newBillNo,
      BILLTYPE: newBillType,
      JOURDATE: date,
      BILLDATE: date,
      BEFORETAX: 1,
      TAX: 1,
      AFTERTAX: 2,
      REMARKS: "Test Bill Creation",
      SALE: "Test User",
    };

    return newBill;
  }

  async function createNewBill(date: Date) {
    const { data, error } = await supabase
      .from("bills")
      .select(`*`)
      .neq("TAX", `0`)
      .ilike("BILLTYPE", `1SY`)
      .lt(
        "BILLDATE",
        new Date(
          `${date.getUTCFullYear().toString()}-${(
            date.getUTCMonth() + 2
          ).toString()}-01 00:00`
        ).toLocaleDateString("en-US")
      )
      .gte(
        "BILLDATE",
        new Date(
          `${date.getUTCFullYear().toString()}-${(
            date.getUTCMonth() + 1
          ).toString()}-01 00:00`
        ).toLocaleDateString("en-US")
      )
      .order("BILLDATE", { ascending: false })
      .limit(1);

    console.log("get latest", data);

    if (error) return;
    // if (data !== null) setLatestBill(data);
    // if (count !== null) setBillCount(count);
    const newBill = formatNewBill(date, data);

    console.log("input", newBill);

    const { data: out, error: outerr } = await supabase
      .from("bills")
      .insert([newBill])
      .select();

    if (outerr) return;

    console.log("output", out);
  }

  function handleConfirmBill() {
    createNewBill(new Date());
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
