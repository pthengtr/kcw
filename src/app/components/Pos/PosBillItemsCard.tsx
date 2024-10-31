import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PosReturnBillSearch from "./PosReturnBillSearch";

export default function PosBillItemsCard() {
  const {
    setCurrentCustomer,
    setCurrentReturnBill,
    billDiscount,
    setBillDiscount,
    returnMode,
    setReturnMode,
    setPosItems,
  } = useContext(PosContext) as PosContextType;

  const { data: session } = useSession();

  function handleReturnModeChange(checked: boolean) {
    setReturnMode(checked);
    setPosItems(undefined);
    setCurrentReturnBill(undefined);
    getDefaultCustomer();
  }

  const getDefaultCustomer = useCallback(() => {
    async function _getDefaultCustomer() {
      const { data, error } = await supabase
        .from("accounts")
        .select(`*`)
        .eq("ACCTTYPE", `S`)
        .eq("ACCTNO", `000`)
        .limit(10);

      if (error) return;
      if (data !== null) setCurrentCustomer(data[0]);
    }
    _getDefaultCustomer();
  }, [setCurrentCustomer]);

  useEffect(() => {
    getDefaultCustomer();
  }, [getDefaultCustomer]);

  return (
    <Card className="w-full pb-8 shadow-md flex flex-col">
      <CardHeader className="h-[22%]">
        <CardTitle className="flex flex-col gap-4">
          <div className="flex justify-between">
            <PosSelectAcount />
            <span className="font-normal text-base italic">
              {session?.user?.name}
            </span>
          </div>

          <Separator />
          <div className="text-center items-center flex">
            <div className="flex-1 text-left flex gap-2">
              {returnMode ? <PosReturnBillSearch /> : <PosProductSheet />}
            </div>
            <span>รายการสินค้า</span>
            <div className="flex-1 text-base gap-2 flex items-center space-x-2 justify-end">
              <Switch
                checked={returnMode}
                onCheckedChange={(checked) => handleReturnModeChange(checked)}
                id="return-mode"
              />
              <Label
                htmlFor="return-mode"
                className={`${
                  returnMode ? "text-gray-800 font-semibold" : "text-gray-400"
                }`}
              >
                คืนสินค้า/ใบลดหนี้
              </Label>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[78%] flex flex-col">
        <PosBillItemsTable />
        <div className="flex justify-center items-start gap-4 text-base mt-8 mx-16 h-fit">
          <PosBillPaymentOptions />
          <PosBillPriceSelect />
          <div className="flex gap-4 items-center">
            <span>ส่วนลดท้ายบิล</span>
            <Input
              disabled={returnMode}
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
