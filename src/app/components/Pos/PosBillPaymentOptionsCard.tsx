import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosRecentBillSheet from "./PosRecentBills/PosRecentBillSheet";

export default function PosBillPaymentOptionsCard() {
  const { vat, setVat, payment, setPayment } = useContext(
    PosContext
  ) as PosContextType;
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="text-center">
        <CardTitle>ตัวเลือกการชำระ</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 place-content-center">
        <Tabs
          value={payment}
          onValueChange={setPayment}
          className="col-span-2 bg-gray-100 rounded-md"
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="cash">
              เงินสด
            </TabsTrigger>
            <TabsTrigger className="w-full " value="credit">
              ลงบัญชี
            </TabsTrigger>
          </TabsList>
        </Tabs>

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

        <div className="col-span-2  text-center hover:bg-gray-100 p-1 rounded-md">
          <PosRecentBillSheet />
        </div>
      </CardContent>
    </Card>
  );
}
