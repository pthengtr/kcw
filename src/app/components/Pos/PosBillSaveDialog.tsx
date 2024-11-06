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
import { DialogClose } from "@radix-ui/react-dialog";
import PosBillTotalCard from "./PosBillTotalCard";
import PosBillSaveDialogCash from "./PosBillSaveDialogCash";
import PosBillSaveDialogTransfer from "./PosBillSaveDialogTransfer";
import { supabase } from "@/app/lib/supabase";
import { billType } from "../Transaction/TransactionProvider";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function PosBillSaveDialog() {
  const {
    payment,
    currentCustomer,
    vat,
    returnMode,
    getSumBeforeTax,
    getSumAmount,
    getSumTax,
    posItems,
    setPosItems,
  } = useContext(PosContext) as PosContextType;

  const { data: session } = useSession();
  const { toast } = useToast();

  function getNoVatPrefix() {
    return vat === "novat" ? "0" : "";
  }

  function formatNewBill(date: Date, data: billType[]) {
    let billHeader, newBillType;

    if (payment === "CASH") {
      billHeader = getNoVatPrefix() + "TR";
      newBillType = `1SY`;
    } else if (payment === "CREDIT") {
      billHeader = getNoVatPrefix() + "TB";
      newBillType = "1SN";
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
      JOURDATE: date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
      BILLDATE: date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
      BEFORETAX:
        vat === "vat" ? toFloat(getSumBeforeTax()) : toFloat(getSumAmount()),
      TAX: vat === "vat" ? toFloat(getSumTax()) : 0,
      AFTERTAX: toFloat(getSumAmount()),
      REMARKS: "Test Bill Creation",
      SALE: session?.user?.name,
      ACCTNO: currentCustomer?.ACCTNO,
      accountId: currentCustomer?.accountId,
    };

    return newBill;
  }

  function toFloat(inStr: string) {
    return parseFloat(inStr.replace(",", ""));
  }

  function formatNewBillItems(date: Date, newBill: billType) {
    return posItems?.map((posItem) => {
      const prices = Object.fromEntries(
        posItem.prices.map((price) => [price.Attribute, price.Value])
      );
      const prices_m = Object.fromEntries(
        posItem.prices_m.map((price) => [price.Attribute, price.Value])
      );

      const itemPrice = posItem.atUnit === "UI1" ? prices : prices_m;
      return {
        itemId: Math.random().toString().substring(2, 14),
        JOURDATE: date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
        BILLNO: newBill.BILLNO,
        BCODE: posItem.BCODE,
        QTY: posItem.QTY,
        UI: posItems[posItem.atUnit as keyof typeof posItems],
        MTP: posItem.MTP,
        PRICE: itemPrice[posItem.atPrice],
        AMOUNT: itemPrice[posItem.atPrice] * posItem.QTY,
        ACCTNO: currentCustomer?.ACCTNO,
        accountId: currentCustomer?.accountId,
        billId: newBill.billId,
      };
    });
  }

  async function createNewBill(date: Date) {
    let query = supabase
      .from("bills")
      .select(`*`)
      .ilike("BILLTYPE", payment === "CASH" ? "1SY" : "1SN")
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

    if (vat === "vat") query = query.neq("TAX", "0");
    else query = query.eq("TAX", "0");

    const { data, error } = await query;

    console.log("get latest", data);

    if (error) {
      console.log(error);
      return;
    }

    const newBill = formatNewBill(date, data);

    console.log("bill input", newBill);
    const { data: outBill, error: outBillErr } = await supabase
      .from("bills")
      .insert([newBill])
      .select();

    if (outBillErr) {
      console.log(outBillErr);
      return;
    }
    console.log("bill output", outBill);

    const newBillItems = formatNewBillItems(date, outBill[0]);

    console.log("items input", outBill);
    const { data: outItems, error: outItemsErr } = await supabase
      .from("items")
      .insert(newBillItems)
      .select();

    if (outItemsErr) {
      console.log("error", outItemsErr);
      toast({ title: "เกิดข้อผิดพลาด", description: "กรุณาลองใหม่อีกครั้ง" });
      return;
    }
    console.log("items output", outItems);

    setPosItems(undefined);

    toast({ title: outBill[0].BILLNO, description: "บันทึกเรียบร้อยแล้ว" });
  }

  function handleConfirmBill() {
    createNewBill(new Date());
  }

  return (
    <Dialog>
      <DialogTrigger
        disabled={!posItems || posItems.length === 0}
        className="bg-secondary hover:bg-red-700 text-4xl py-10 shadow-md text-white rounded-md"
      >
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
          <DialogClose
            onClick={handleConfirmBill}
            className="bg-secondary hover:bg-red-700 font-bold text-white text-xl p-2 rounded-md"
          >
            ยืนยัน
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
