"use client";

import PurchaseBillItemsCard from "./PurchaseBillItemsCard";
import PurchaseBillTotalCard from "./PurchaseBillTotalCard";

export default function PurchasePage() {
  return (
    <main className="h-[90%] flex mx-auto ">
      <div className="w-[1280px] flex gap-4 p-4">
        <div className="flex flex-1 justify-center gap-8">
          <PurchaseBillItemsCard />
        </div>
        <div className="flex flex-col justify-start gap-4 min-w-72">
          <PurchaseBillTotalCard />
          {/*<PosBillSaveDialog /> */}
          <div className="col-span-2  text-center hover:bg-gray-100 p-1 rounded-md text-base">
            {/* <PosRecentBillSheet /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
