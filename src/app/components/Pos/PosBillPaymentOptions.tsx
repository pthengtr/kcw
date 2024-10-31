import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PosBillPaymentOptions() {
  const { vat, setVat, payment, setPayment, returnMode } = useContext(
    PosContext
  ) as PosContextType;
  return (
    <div className="flex gap-4 items-center">
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

      {!returnMode && (
        <Tabs
          value={vat}
          onValueChange={setVat}
          className="col-span-2 bg-gray-100 rounded-md"
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="novat">
              ไม่รวม VAT
            </TabsTrigger>
            <TabsTrigger className="w-full" value="vat">
              VAT
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
}
