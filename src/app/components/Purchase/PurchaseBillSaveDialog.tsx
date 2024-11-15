import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PosContext, PosContextType } from "../Pos/PosProvider";
import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogClose } from "@radix-ui/react-dialog";
import { supabase } from "@/app/lib/supabase";
import { billType } from "../Transaction/TransactionProvider";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { SearchContext, SearchContextType } from "../SearchProvider";
import { PurchaseContext, PurchaseContextType } from "./PurchaseProvider";

export default function PurchaseBillSaveDialog() {
  const { payment, currentCustomer, vat, returnMode, posItems, setPosItems } =
    useContext(PosContext) as PosContextType;

  const {
    purchaseBillDate,
    purchaseBillNo,
    getTotalCostBeforeVat,
    getTotalCostAfterVat,
    getTotalTax,
  } = useContext(PurchaseContext) as PurchaseContextType;

  const { branch } = useContext(SearchContext) as SearchContextType;

  console.log(branch);

  const { data: session } = useSession();
  const { toast } = useToast();

  function formatNewBill(date: Date, data: billType[]): billType {
    let newBillType;

    console.log(data);

    if (payment === "CASH") {
      newBillType = `1PY`;
    } else if (payment === "CREDIT") {
      newBillType = "1PN";
    }

    const newBillId = Math.random().toString().substring(2, 14);

    const newBill: billType = {
      billId: parseInt(newBillId),
      BILLTYPE: !!newBillType ? newBillType : "",
      JOURDATE: date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
      BILLDATE: purchaseBillDate.toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      }),
      BILLNO: purchaseBillNo,
      DISCOUNT: 0,
      DEDUCT: 0,
      BEFORETAX:
        vat === "vat"
          ? toFloat(getTotalCostBeforeVat())
          : toFloat(getTotalCostAfterVat()),
      TAX: vat === "vat" ? toFloat(getTotalTax()) : 0,
      AFTERTAX: toFloat(getTotalCostAfterVat()),
      PO: "",
      DUEDATE: null,
      REMARKS: "Test Purchase Bill Creation",
      accountId: !!currentCustomer ? currentCustomer.accountId : null,
      voucherId: null,
      noteId: null,
      ACCTNO: !!currentCustomer ? currentCustomer.ACCTNO : "",
      SALE: !!session
        ? session.user
          ? (session.user.name as string)
          : ""
        : "",
      CANCELED: "N",
    };

    return newBill;
  }

  function toFloat(inStr: string) {
    return parseFloat(inStr.replace(",", ""));
  }

  function formatNewBillItems(date: Date, newBill: billType) {
    return posItems?.map((posItem) => {
      return {
        itemId: Math.random().toString().substring(2, 14),
        JOURDATE: date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
        BILLNO: newBill.BILLNO,
        BCODE: posItem.BCODE,
        QTY: posItem.QTY,
        UI: posItems[posItem.atUnit as keyof typeof posItems],
        MTP: posItem.MTP,
        PRICE: 0, //TODO
        AMOUNT: 0, //TODO
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
      .ilike("BILLTYPE", payment === "CASH" ? "1PY" : "1PN")
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
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง",
        action: <CancelSVG />,
        className: "text-xl",
      });
      return;
    }

    const newBill: billType = formatNewBill(date, data);
    const newBillItems = formatNewBillItems(date, newBill);

    console.log(newBill);
    console.log(newBillItems);
    // console.log("bill input", newBill);
    // const { data: outBill, error: outBillErr } = await supabase
    //   .from("bills")
    //   .insert([newBill])
    //   .select();

    // if (outBillErr) {
    //   toast({
    //     title: "เกิดข้อผิดพลาด",
    //     description: "กรุณาลองใหม่อีกครั้ง",
    //     action: <CancelSVG />,
    //     className: "text-xl",
    //   });
    //   return;
    // }
    // console.log("bill output", outBill);

    // const newBillItems = formatNewBillItems(date, outBill[0]);

    // console.log("items input", outBill);
    // const { data: outItems, error: outItemsErr } = await supabase
    //   .from("items")
    //   .insert(newBillItems)
    //   .select();

    // if (outItemsErr) {
    //   console.log("error", outItemsErr);
    //   toast({
    //     title: "เกิดข้อผิดพลาด",
    //     description: "กรุณาลองใหม่อีกครั้ง",
    //     action: <CancelSVG />,
    //     className: "text-xl",
    //   });
    //   return;
    // }
    // console.log("items output", outItems);

    setPosItems(undefined);

    toast({
      title: "0TR6711-0002",
      description: "บันทึกเรียบร้อยแล้ว",
      action: <CheckCircleSVG />,
      className: "text-xl",
    });
  }

  function handleConfirmBill() {
    createNewBill(new Date());
  }

  return (
    // <Button
    //   onClick={() =>
    //     toast({
    //       title: "เกิดข้อผิดพลาด",
    //       description: "กรุณาลองใหม่อีกครั้ง",
    //       action: <CancelSVG />,
    //       className: "text-xl",
    //     })
    //   }
    // >
    //   Test Toast
    // </Button>

    <Dialog>
      <DialogTrigger
        disabled={!posItems || posItems.length === 0}
        className="bg-secondary hover:bg-red-700 text-4xl py-10 shadow-md text-white rounded-md"
      >
        {payment === "CASH" ? "ชำระเงิน" : "บันทึก"}
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-fit [&>button]:hidden">
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
              //   <PosBillTotalCard />
              <></>
            ) : (
              <Tabs>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cash">เงินสด</TabsTrigger>
                  <TabsTrigger value="transfer">โอน</TabsTrigger>
                </TabsList>
                <TabsContent value="cash">
                  {/* <PosBillSaveDialogCash /> */}
                </TabsContent>
                <TabsContent value="transfer">
                  {/* <PosBillSaveDialogTransfer /> */}
                </TabsContent>
              </Tabs>
            )}
          </section>
        )}

        {payment === "CREDIT" && (
          <section className="w-[680px]">{/* <PosBillTotalCard /> */}</section>
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

function CheckCircleSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="42px"
      viewBox="0 -960 960 960"
      width="42px"
      fill="#12961d"
    >
      <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}

function CancelSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="42px"
      viewBox="0 -960 960 960"
      width="42px"
      fill="#d62c2c"
    >
      <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}
