import { Label } from "@/components/ui/label";
import TransactionItemList from "./TransactionItemList";
import { itemsType, billType } from "./TransactionProvider";
import React from "react";

type TransactionBillsItemListProps = {
  currentBillItems: itemsType[] | undefined;
  currentBill: billType | undefined;
};

const paymentName = {
  CASH: "เงินสด",
  TRANSFER: "โอน",
  CHECK: "เช็ค",
  VOUCHER: "ใบสำคัญ",
};

export default function TransactionBillsItemList({
  currentBillItems,
  currentBill,
}: TransactionBillsItemListProps) {
  return (
    <>
      {currentBillItems && (
        <div className="w-full h-full overflow-auto text-lg p-4 flex flex-col gap-4">
          {currentBill && (
            <div className="flex flex-col gap-4 justify-center">
              <div className="flex gap-4 justify-center items-baseline">
                <Label>บิลเลขที่</Label>
                <span className="bg-gray-100 font-semibold p-1 rounded-md">
                  {currentBill.BILLNO}
                </span>
                <Label>พนักงาน</Label>
                <span className="bg-gray-100 font-semibold p-1 rounded-md">
                  {currentBill.SALE}
                </span>
              </div>
              <div className="flex gap-4 justify-center items-baseline">
                {currentBill.accounts?.ACCTTYPE === "P" && (
                  <>
                    <Label>วันที่ของเข้า</Label>
                    <span className="bg-gray-100 font-semibold p-1 rounded-md">
                      {new Date(currentBill.JOURDATE).toLocaleDateString(
                        "th-TH"
                      )}
                    </span>
                  </>
                )}
                <Label>วันที่หน้าบิล</Label>
                <span className="bg-gray-100 font-semibold p-1 rounded-md">
                  {new Date(currentBill.BILLDATE).toLocaleDateString("th-TH")}
                </span>
                {!!currentBill.DUEDATE && (
                  <>
                    <Label>ครบกำหนด</Label>
                    <span className="bg-gray-100 font-semibold p-1 rounded-md">
                      {new Date(currentBill.DUEDATE).toLocaleDateString(
                        "th-TH"
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <TransactionItemList
            currentItems={currentBillItems}
            isVat={!!currentBill && currentBill.TAX > 0}
          />

          {currentBill && (
            <div className="grid grid-cols-2 gap-4 mr-8 text-base mt-auto h-fit justify-items-end">
              <div className="grid grid-cols-2 w-fit justify-end gap-4 border p-4 rounded-lg">
                {currentBill.bill_payment &&
                currentBill.bill_payment.length > 0 ? (
                  <>
                    {currentBill.bill_payment.map((payment) => (
                      <React.Fragment key={payment.PAYTYPE}>
                        <span>
                          {payment.PAYTYPE !== "VOUCHER"
                            ? paymentName[
                                payment.PAYTYPE as keyof typeof paymentName
                              ]
                            : currentBill.vouchers?.VOUCNO}
                        </span>
                        <span className="font-semibold text-right">
                          {payment.AMOUNT.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </React.Fragment>
                    ))}
                    <span>ค้างชำระ</span>
                    <span className="font-semibold text-right">
                      {currentBill.DUEAMT.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <span>ค้างชำระ</span>
                    <span className="font-semibold text-right">
                      {currentBill.AFTERTAX.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 w-fit justify-end gap-4 border p-4 rounded-lg">
                <span>จำนวนเงิน</span>
                <span className="font-semibold text-right">
                  {currentBill.BEFORETAX.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span>ภาษี</span>
                <span className="font-semibold text-right">
                  {currentBill.TAX.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span>ยอดรวม</span>
                <span className="font-semibold text-right">
                  {currentBill.AFTERTAX.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {!!currentBill.REMARKS && (
                  <>
                    <span>หมายเหตุ</span>
                    <span>{currentBill.REMARKS}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
