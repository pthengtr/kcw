import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../../lib/supabase";
import { billsType, itemsType } from "./TransactionProvider";
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
  const [accountBills, setAccountBills] = useState<billsType[]>();
  const [currentBill, setCurrentBill] = useState<billsType>();
  const [currentBillItems, setCurrentBillItems] = useState<itemsType[]>();

  const { toDate, fromDate } = useContext(
    TransactionContext
  ) as TransactionContextType;

  function handleClickBill(bill: billsType) {
    async function getCurrentBillItemsSupabase() {
      const { data, error } = await supabase
        .from("_items")
        .select(`*, productInfo(*)`)
        .eq("BILLNO", bill.BILLNO)
        .order("JOURDATE", { ascending: false })
        .limit(100);

      console.log(data);

      if (error) return;
      if (data !== null) setCurrentBillItems(data);
    }

    setCurrentBill(bill);
    getCurrentBillItemsSupabase();
  }

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error } = await supabase
        .from("_bills")
        .select(`*, _vouchers(*), _notes(*)`)
        .eq("accountId", accountId)
        .order("JOURDATE", { ascending: false })
        .lte("NOTEDATE", toDate.toLocaleString())
        .gte("NOTEDATE", fromDate.toLocaleString())
        .limit(100);

      if (error) return;
      if (data !== null) setAccountBills(data);
    }

    getBillsSupabase();
  }, [accountId, setAccountBills, fromDate, toDate]);

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
