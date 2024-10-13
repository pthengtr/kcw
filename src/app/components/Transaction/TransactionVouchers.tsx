import { useEffect, useState, useContext } from "react";
import { supabase } from "@/app/lib/supabase";
import { voucherType, billsType } from "./TransactionProvider";
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
  const [accountVouchers, setAccountVouchers] = useState<voucherType[]>();
  const [currentVoucher, setCurrentVoucher] = useState<voucherType>();
  const [currentVoucherBills, setCurrentVoucherBills] = useState<billsType[]>();
  const { toDate, fromDate, filterText } = useContext(
    TransactionContext
  ) as TransactionContextType;

  function handleClickVoucher(voucher: voucherType) {
    async function getCurrentVoucherBillsSupabase() {
      const { data, error } = await supabase
        .from("_bills")
        .select(`*, _vouchers(*), _notes(*)`)
        .eq("voucherId", voucher.voucherId)
        .order("JOURDATE", { ascending: false })
        .limit(100);

      if (error) return;
      if (data !== null) setCurrentVoucherBills(data);
    }

    setCurrentVoucher(voucher);
    getCurrentVoucherBillsSupabase();
  }

  useEffect(() => {
    async function getBillsSupabase() {
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

    getBillsSupabase();
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
          <ResizablePanel className="h-[70vh]">
            <TransactionBillList currentBills={currentVoucherBills} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
