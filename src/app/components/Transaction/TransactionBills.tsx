import React, { useEffect, useContext, useState } from "react";
import { supabase } from "../../lib/supabase";
import { billType } from "./TransactionProvider";
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

export default function TransactionBills() {
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
    billType,
    currentAccount,
  } = useContext(TransactionContext) as TransactionContextType;
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState("50");

  const [sortBy, setSortBy] = useState("JOURDATE");
  const [sortAsc, setSortAsc] = useState(false);

  function handleClickColumn(column: string) {
    if (sortBy === column) {
      setSortAsc((cur) => !cur);
      return;
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  }

  function handleClickBill(bill: billType) {
    setCurrentBill(bill);
    getCurrentBillItemsSupabase(bill.BILLNO);
  }

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error, count } = await supabase
        .from("bills")
        .select(`*, vouchers(*), notes(*), accounts(*), bill_payment(*)`, {
          count: "exact",
        })
        .ilike("BILLNO", `%${filterText}%`)
        .ilike("BILLTYPE", `${billType}%`)
        .eq("accountId", currentAccount?.accountId)
        .order(sortBy, { ascending: sortAsc })
        .lte("JOURDATE", toDate.toLocaleString("en-US"))
        .gte("JOURDATE", fromDate.toLocaleString("en-US"))
        .limit(parseInt(limit));

      if (error) return;
      if (data !== null) setAccountBills(data);
      if (count !== null) setTotalCount(count);
    }

    getBillsSupabase();
  }, [
    currentAccount,
    setAccountBills,
    fromDate,
    toDate,
    filterText,
    setTotalCount,
    limit,
    sortBy,
    sortAsc,
    billType,
  ]);

  const sumAmt = accountBills
    ? accountBills.reduce((acc, item) => item.AFTERTAX + acc, 0)
    : 0;

  return (
    <>
      {accountBills && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[80vh] flex flex-col gap-4">
            <TransactionBillsBillList
              accountBills={accountBills}
              handleClickBill={handleClickBill}
              currentBill={currentBill}
              handleClickColumn={handleClickColumn}
            />
            <div className="flex gap-4 justify-end items-center">
              <div className="flex gap-2">
                <span>ยอดรวมทั้งหมด</span>
                <span className="font-semibold">
                  {sumAmt.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <TransactionTotalCount
                totalCount={totalCount}
                limit={limit}
                setLimit={setLimit}
              />
            </div>
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
