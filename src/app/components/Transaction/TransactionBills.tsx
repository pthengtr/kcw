import React, { useEffect, useContext, useState } from "react";
import { supabase } from "../../lib/supabase";
import { billsType } from "./TransactionProvider";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import TransactionBillsBillList from "./TransactionBillsBillList";
import TransactionBillsItemList from "./TransactionBillsItemList";
import TransactionTotalCount from "../TotalCount";

type TransactionAccountBillsProps = {
  accountId: string;
};

export default function TransactionBills({
  accountId,
}: TransactionAccountBillsProps) {
  const {
    toDate,
    fromDate,
    filterText,
    accountBills,
    setAccountBills,
    currentBill,
    setCurrentBill,
    currentBillItems,
    getCurrentBillItemsSupabase,
  } = useContext(TransactionContext) as TransactionContextType;
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState("50");

  function handleClickBill(bill: billsType) {
    setCurrentBill(bill);
    getCurrentBillItemsSupabase(bill.BILLNO);
  }

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error, count } = await supabase
        .from("_bills")
        .select(`*, _vouchers(*), _notes(*)`, { count: "exact" })
        .ilike("BILLNO", `%${filterText}%`)
        .eq("accountId", accountId)
        .order("JOURDATE", { ascending: false })
        .lte("JOURDATE", toDate.toLocaleString())
        .gte("JOURDATE", fromDate.toLocaleString())
        .limit(parseInt(limit));

      if (error) return;
      if (data !== null) setAccountBills(data);
      if (count !== null) setTotalCount(count);
    }

    getBillsSupabase();
  }, [
    accountId,
    setAccountBills,
    fromDate,
    toDate,
    filterText,
    setTotalCount,
    limit,
  ]);

  return (
    <>
      {accountBills && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[80vh] flex flex-col gap-4">
            <TransactionBillsBillList
              accountBills={accountBills}
              handleClickBill={handleClickBill}
              currentBill={currentBill}
            />
            <TransactionTotalCount
              totalCount={totalCount}
              limit={limit}
              setLimit={setLimit}
            />
          </ResizablePanel>
          <ResizableHandle className="p-0.5 m-1 bg-slate-100" />
          <ResizablePanel className="h-[80vh]">
            <TransactionBillsItemList
              currentBill={currentBill}
              currentBillItems={currentBillItems}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
