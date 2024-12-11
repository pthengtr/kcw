import React, { useEffect, useContext, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { voucherType } from "./TransactionProvider";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import TransactionVouchersVoucherList from "./TransactionVouchersVoucherList";
import TransactionTotalCount from "../TotalCount";
import TransactionVouchersBillList from "./TransactionVouchersBillList";

export default function TransactionVouchers() {
  const {
    toDate,
    fromDate,
    filterText,
    accountVouchers,
    setAccountVouchers,
    currentVoucher,
    setCurrentVoucher,
    currentVoucherBills,
    getCurrentVoucherBillsSupabase,
    currentAccount,
  } = useContext(TransactionContext) as TransactionContextType;
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState("50");

  const [sortBy, setSortBy] = useState("VOUCDATE");
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

  function handleClickVoucher(voucher: voucherType) {
    setCurrentVoucher(voucher);
    getCurrentVoucherBillsSupabase(voucher.voucherId);
  }

  useEffect(() => {
    async function getVouchersSupabase() {
      const { data, error, count } = await supabase
        .from("vouchers")
        .select(`*, accounts(*), checks(*)`, { count: "exact" })
        .ilike("VOUCNO", `%${filterText}%`)
        .eq("accountId", currentAccount?.accountId)
        .lte("VOUCDATE", toDate.toLocaleString("en-US"))
        .gte("VOUCDATE", fromDate.toLocaleString("en-US"))
        .order(sortBy, { ascending: sortAsc })
        .limit(parseInt(limit));

      if (error) return;
      if (data !== null) setAccountVouchers(data);
      if (count !== null) setTotalCount(count);
    }

    getVouchersSupabase();
  }, [
    currentAccount,
    setAccountVouchers,
    fromDate,
    toDate,
    filterText,
    limit,
    sortBy,
    sortAsc,
  ]);

  return (
    <>
      {accountVouchers && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[80vh] flex flex-col gap-4">
            <TransactionVouchersVoucherList
              accountVouchers={accountVouchers}
              currentVoucher={currentVoucher}
              handleClickVoucher={handleClickVoucher}
              handleClickColumn={handleClickColumn}
            />
            <TransactionTotalCount
              totalCount={totalCount}
              limit={limit}
              setLimit={setLimit}
            />
          </ResizablePanel>
          <ResizableHandle className="p-0.5 m-1 bg-slate-100" />
          <ResizablePanel className="h-[80vh] ">
            {!!currentVoucher && (
              <TransactionVouchersBillList
                currentVoucher={currentVoucher}
                currentVoucherBills={currentVoucherBills}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
