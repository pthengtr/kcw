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
import TransactionBillList from "./TransactionBillList";
import TransactionTotalCount from "../TotalCount";
import { Separator } from "@radix-ui/react-dropdown-menu";

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
        .select(`*, accounts(*), checks(*)`, { count: "exact" })
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
                  <span>{`ใบสำคัญ${
                    currentVoucher
                      ? currentVoucher.accounts.ACCTTYPE === "P"
                        ? "จ่าย"
                        : "รับ"
                      : ""
                  }เลขที่`}</span>
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
                  acctType={currentVoucher.accounts.ACCTTYPE}
                />
                {currentVoucher && (
                  <div className="flex justify-end pb-16 px-16 text-base mt-auto  h-fit">
                    <div className="grid grid-cols-[auto_auto] w-fit justify-end gap-x-8 gap-y-4 border p-4 rounded-lg">
                      <span>จำนวนเงิน</span>
                      <span className="font-semibold">
                        {currentVoucher.BILLAMT.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span>ส่วนลด</span>
                      <span className="font-semibold">
                        {currentVoucher.DISCOUNT.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span>ยอดรวม</span>
                      <span className="font-semibold">
                        {currentVoucher.NETAMT.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <Separator className="col-span-2 border-b-2" />
                      {currentVoucher.CASHAMT > 0 && (
                        <>
                          <span>เงินสด</span>
                          <span className="font-semibold">
                            {currentVoucher.CASHAMT.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </>
                      )}
                      {currentVoucher.CHKAMT > 0 && (
                        <>
                          <span>เช็ค</span>
                          <span className="font-semibold">
                            {currentVoucher.CHKAMT.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>

                          {currentVoucher.checks &&
                            currentVoucher.checks.map((check) => (
                              <React.Fragment key={check.checkId}>
                                <span>เช็คเลขที่</span>
                                <span className="font-semibold">
                                  {check.CHKNO}
                                </span>
                                <span>ธนาคาร</span>
                                <span className="font-semibold">
                                  {check.BANKNAME}
                                </span>
                              </React.Fragment>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
