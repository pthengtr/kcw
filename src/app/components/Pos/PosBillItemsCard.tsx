import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect } from "react";
import { PosContext, PosContextType } from "./PosProvider";
import { useSession } from "next-auth/react";
import PosSelectAcount from "./PosSelectAccount";
import PosBillPriceSelect from "./PosBillPriceSelect";
import PosProductSheet from "./PosProductSheet";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/app/lib/supabase";
import { Input } from "@/components/ui/input";
import PosBillItemsTable from "./PosBillItemsTable";
import PosBillPaymentOptions from "./PosBillPaymentOptions";

export default function PosBillItemsCard() {
  const { setCurrentCustomer, billDiscount, setBillDiscount } = useContext(
    PosContext
  ) as PosContextType;

  const { data: session } = useSession();

  useEffect(() => {
    async function getDefaultCustomer() {
      const { data, error } = await supabase
        .from("accounts")
        .select(`*`)
        .eq("ACCTTYPE", `S`)
        .eq("ACCTNO", `000`)
        .limit(10);

      if (error) return;
      if (data !== null) setCurrentCustomer(data[0]);
    }

    getDefaultCustomer();
  }, [setCurrentCustomer]);

  return (
    <Card className="w-full pb-8 shadow-md flex flex-col">
      <CardHeader className="h-[25%]">
        <CardTitle className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <PosSelectAcount />
            <PosBillPaymentOptions />
            <PosBillPriceSelect />
          </div>
          <Separator />
          <div className="text-center items-center flex">
            <div className="flex-1 text-left">
              <PosProductSheet />
            </div>
            <span>รายการสินค้า</span>
            <div className="flex-1 text-base flex flex-col justify-end text-right gap-2">
              <span className="font-normal italic">{session?.user?.name}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[75%] flex flex-col">
        <PosBillItemsTable />
        <div className="flex justify-end items-start text-base mt-8 mx-16 h-fit">
          <div className="flex gap-4 items-center">
            <span>ส่วนลดท้ายบิล</span>
            <Input
              type="number"
              value={billDiscount}
              onChange={(e) => setBillDiscount(e.target.value)}
              className="w-20 text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-transparent"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
