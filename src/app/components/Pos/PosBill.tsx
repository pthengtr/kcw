import PosBillItemsCard from "./PosBillItemsCard";
import PosBillHeaderCard from "./PosBillHeaderCard";
import PosBillTotalCard from "./PosBillTotalCard";
import PosBillPaymentOptionsCard from "./PosBillPaymentOptionsCard";
import { Button } from "@/components/ui/button";

export default function PosBill() {
  return (
    <div className="w-[1280px] flex gap-4 p-4">
      <div className="flex flex-1 justify-center gap-8">
        <PosBillItemsCard />
      </div>
      <div className="flex flex-col justify-start gap-8 min-w-72">
        <PosBillTotalCard />
        <PosBillHeaderCard />
        <PosBillPaymentOptionsCard />
        <Button className="bg-secondary hover:bg-red-700 text-4xl py-10">
          <div className="flex gap-4 items-center">
            <span>บันทึก</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
