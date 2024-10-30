import PosBillItemsCard from "./PosBillItemsCard";
import PosBillTotalCard from "./PosBillTotalCard";
import PosBillSaveDialog from "./PosBillSaveDialog";
import PosRecentBillSheet from "./PosRecentBills/PosRecentBillSheet";

export default function PosBill() {
  return (
    <div className="w-[1280px] flex gap-4 p-4">
      <div className="flex flex-1 justify-center gap-8">
        <PosBillItemsCard />
      </div>
      <div className="flex flex-col justify-start gap-4 min-w-72">
        <PosBillTotalCard />
        <PosBillSaveDialog />
        <div className="col-span-2  text-center hover:bg-gray-100 p-1 rounded-md text-base">
          <PosRecentBillSheet />
        </div>
      </div>
    </div>
  );
}
