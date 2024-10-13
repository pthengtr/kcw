import React, { useEffect, useContext } from "react";
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

  function handleClickBill(bill: billsType) {
    setCurrentBill(bill);
    getCurrentBillItemsSupabase(bill.BILLNO);
  }

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error } = await supabase
        .from("_bills")
        .select(`*, _vouchers(*), _notes(*)`)
        .ilike("BILLNO", `%${filterText}%`)
        .eq("accountId", accountId)
        .order("JOURDATE", { ascending: false })
        .lte("JOURDATE", toDate.toLocaleString())
        .gte("JOURDATE", fromDate.toLocaleString())
        .limit(100);

      if (error) return;
      if (data !== null) setAccountBills(data);
    }

    getBillsSupabase();
  }, [accountId, setAccountBills, fromDate, toDate, filterText]);

  return (
    <>
      {accountBills && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[70vh]">
            <TransactionBillsBillList
              accountBills={accountBills}
              handleClickBill={handleClickBill}
              currentBill={currentBill}
            />
          </ResizablePanel>
          <ResizableHandle className="p-0.5 m-1 bg-slate-100" />
          <ResizablePanel className="h-[70vh]">
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
