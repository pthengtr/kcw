import React from "react";
import { voucherType, billType } from "./TransactionProvider";
import { Separator } from "@/components/ui/separator";
import TransactionBillList from "./TransactionBillList";

type TransactionVouchersBillListProps = {
  currentVoucher: voucherType;
  currentVoucherBills: billType[] | undefined;
};

export default function TransactionVouchersBillList({
  currentVoucher,
  currentVoucherBills,
}: TransactionVouchersBillListProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex gap-4 justify-center text-lg">
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
          {new Date(currentVoucher.VOUCDATE).toLocaleDateString("th-TH")}
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
                      <span className="font-semibold">{check.CHKNO}</span>
                      <span>ธนาคาร</span>
                      <span className="font-semibold">{check.BANKNAME}</span>
                    </React.Fragment>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
