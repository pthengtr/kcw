import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useContext } from "react";
import { PosContext, PosContextType } from "./PosProvider";

export default function PosBillPaymentOptionsCard() {
  const { vat, setVat, payment, setPayment } = useContext(
    PosContext
  ) as PosContextType;
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>ตัวเลือกการชำระ</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 place-content-center">
        <ToggleGroup
          value={payment}
          onValueChange={setPayment}
          className="col-span-2 bg-gray-100 rounded-md"
          type="single"
        >
          <ToggleGroupItem
            className="w-full data-[state=on]:bg-gray-300 data-[state=on]:text-black text-gray-400"
            value="cash"
          >
            เงินสด
          </ToggleGroupItem>
          <ToggleGroupItem
            className="w-full data-[state=on]:bg-gray-300 data-[state=on]:text-black text-gray-400"
            value="transfer"
          >
            โอน
          </ToggleGroupItem>
          <ToggleGroupItem
            className="w-full data-[state=on]:bg-gray-300 data-[state=on]:text-black text-gray-400"
            value="credit"
          >
            ลงบัญชี
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          value={vat}
          onValueChange={setVat}
          className="col-span-2 bg-gray-100 rounded-md"
          type="single"
        >
          <ToggleGroupItem
            className="w-full data-[state=on]:bg-gray-300 data-[state=on]:text-black text-gray-400"
            value="novat"
          >
            ไม่รวม VAT
          </ToggleGroupItem>
          <ToggleGroupItem
            className="w-full data-[state=on]:bg-gray-300 data-[state=on]:text-black text-gray-400"
            value="vat"
          >
            VAT
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
