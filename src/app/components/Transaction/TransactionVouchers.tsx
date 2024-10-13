import { useEffect, useContext } from "react";
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

  function handleClickVoucher(voucher: voucherType) {
    setCurrentVoucher(voucher);
    getCurrentVoucherBillsSupabase(voucher.voucherId);
  }

  useEffect(() => {
    async function getVouchersSupabase() {
      const { data, error } = await supabase
        .from("_vouchers")
        .select(`*, _accounts(*)`)
        .ilike("VOUCNO", `%${filterText}%`)
        .eq("accountId", accountId)
        .lte("VOUCDATE", toDate.toLocaleString())
        .gte("VOUCDATE", fromDate.toLocaleString())
        .order("VOUCDATE", { ascending: false })
        .limit(100);

      if (error) return;
      if (data !== null) setAccountVouchers(data);
    }

    getVouchersSupabase();
  }, [accountId, setAccountVouchers, fromDate, toDate, filterText]);

  return (
    <>
      {accountVouchers && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[70vh]">
            <TransactionVouchersVoucherList
              accountVouchers={accountVouchers}
              currentVoucher={currentVoucher}
              handleClickVoucher={handleClickVoucher}
            />
          </ResizablePanel>
          <ResizableHandle className="p-0.5 m-1 bg-slate-100" />
          <ResizablePanel className="h-[70vh] flex flex-col gap-6">
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
