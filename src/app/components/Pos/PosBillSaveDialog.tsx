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

export default function PosBillSaveDialog() {
  const { payment, currentCustomer, vat, returnMode } = useContext(
    PosContext
  ) as PosContextType;

  return (
    <Dialog>
      <DialogTrigger className="bg-secondary hover:bg-red-700 text-4xl py-10 shadow-md text-white rounded-md">
        {payment === "CASH" ? "ชำระเงิน" : "บันทึก"}
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-fit">
        <DialogHeader className="p-4">
          <DialogTitle className="text-3xl flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              {vat === "vat" && (
                <span className="bg-secondary rounded-md text-white px-2 text-xl">
                  VAT
                </span>
              )}

              <span>บิลเลขที่ XXX-XXXX</span>
            </div>
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
          <Button className="bg-secondary hover:bg-red-700 font-bold text-xl p-2">
            ยืนยัน
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
