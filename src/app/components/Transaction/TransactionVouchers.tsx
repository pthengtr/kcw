import { useEffect, useContext, useState } from "react";
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
import TransactionBillList from "./TransactionBillList";
import TransactionTotalCount from "../TotalCount";

type TransactionVouchersProps = {
  accountId: string;
};

export default function TransactionVouchers({
  accountId,
}: TransactionVouchersProps) {
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
        .select(`*, accounts(*)`, { count: "exact" })
        .ilike("VOUCNO", `%${filterText}%`)
        .eq("accountId", accountId)
        .lte("VOUCDATE", toDate.toLocaleString())
        .gte("VOUCDATE", fromDate.toLocaleString())
        .order(sortBy, { ascending: sortAsc })
        .limit(parseInt(limit));

      if (error) return;
      if (data !== null) setAccountVouchers(data);
      if (count !== null) setTotalCount(count);
    }

    getVouchersSupabase();
  }, [
    accountId,
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
          <ResizablePanel className="h-[80vh] flex flex-col gap-6">
            {currentVoucher && (
              <>
                <div className="flex gap-4 justify-center mt-6 text-lg">
                  <span>ใบสำคัญเลขที่</span>
                  <span className="font-semibold">{currentVoucher.VOUCNO}</span>
                  <span>วันที่</span>
                  <span className="font-semibold">
                    {new Date(currentVoucher.VOUCDATE).toLocaleDateString(
                      "th-TH"
                    )}
                  </span>
                </div>
                <TransactionBillList
                  currentBills={currentVoucherBills}
                  mode="vouchers"
                />
              </>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
