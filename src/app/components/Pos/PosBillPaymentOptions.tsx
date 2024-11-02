import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PosBillPaymentOptions() {
  const { vat, setVat, payment, setPayment, returnMode, currentCustomer } =
    useContext(PosContext) as PosContextType;

  function isVatOrCreditAllow() {
    return (
      !!currentCustomer &&
      currentCustomer.ACCTNO !== "000" &&
      currentCustomer.ACCTNO !== "7000"
    );
  }

  function handleSetVat(value: string) {
    if (value === "vat" && !isVatOrCreditAllow()) return;

    setVat(value);
  }

  function handleSetPayment(value: string) {
    if (value === "CREDIT" && !isVatOrCreditAllow()) return;

    setPayment(value);
  }

  return (
    <div className="flex gap-4 items-center">
      <Tabs
        value={payment}
        onValueChange={handleSetPayment}
        className="col-span-2 bg-gray-100 rounded-md"
      >
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="CASH">
            เงินสด
          </TabsTrigger>
          <TabsTrigger
            disabled={!isVatOrCreditAllow()}
            className="w-full "
            value="CREDIT"
          >
            ลงบัญชี
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {!returnMode && (
        <Tabs
          value={vat}
          onValueChange={handleSetVat}
          className="col-span-2 bg-gray-100 rounded-md"
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="novat">
              ไม่รวม VAT
            </TabsTrigger>
            <TabsTrigger
              disabled={!isVatOrCreditAllow()}
              className="w-full"
              value="vat"
            >
              VAT
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
}
