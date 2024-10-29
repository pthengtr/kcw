import { billType } from "../../Transaction/TransactionProvider";
import { Separator } from "@/components/ui/separator";

type PosRecentBillSummaryProps = {
  posFilterRecentBills: billType[];
  posRecentBills: billType[] | undefined;
};
export default function PosRecentBillSummary({
  posFilterRecentBills,
  posRecentBills,
}: PosRecentBillSummaryProps) {
  function getSumPaytype(paytype: string) {
    return _getSumPaytype(paytype)?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function _getSumPaytype(paytype: string) {
    if (!posRecentBills) return;

    if (paytype === "CREDIT") {
      return posRecentBills.reduce(
        (acc, bill) =>
          acc +
          bill.bill_payment.reduce(
            (acc, payment) =>
              payment.PAYTYPE !== "VOUCHER" ? acc - payment.AMOUNT : acc,
            bill.AFTERTAX
          ),
        0
      );
    } else {
      const paytypeBills = posRecentBills.filter(
        (bill) =>
          bill.bill_payment.filter((payment) => payment.PAYTYPE === paytype)
            .length != 0
      );
      return paytypeBills.reduce(
        (acc, bill) =>
          acc +
          bill.bill_payment.reduce((acc, payment) => acc + payment.AMOUNT, 0),
        0
      );
    }
  }

  return (
    <div className="flex gap-12 justify-end mx-4">
      <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2 p-4 w-fit border rounded-md h-fit">
        <span>รายการบิลที่แสดง</span>
        <span className="font-semibold text-right">
          {posFilterRecentBills?.length}
        </span>
        <span>รายการบิลทั้งหมด</span>
        <span className="font-semibold text-right">
          {posRecentBills?.length}
        </span>
      </div>
      <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2 p-4 w-fit border rounded-md h-fit">
        {_getSumPaytype("CASH") !== 0 && (
          <>
            <span>เงินสด</span>
            <span className="font-semibold text-right">
              {getSumPaytype("CASH")}
            </span>
          </>
        )}

        {_getSumPaytype("TRANSFER") !== 0 && (
          <>
            <span>โอน</span>
            <span className="font-semibold text-right">
              {getSumPaytype("TRANSFER")}
            </span>
          </>
        )}

        {_getSumPaytype("CHECK") !== 0 && (
          <>
            <span>เช็ค</span>
            <span className="font-semibold text-right">
              {getSumPaytype("CHECK")}
            </span>
          </>
        )}

        {_getSumPaytype("CREDIT") !== 0 && (
          <>
            <span>ลงบัญชี</span>
            <span className="font-semibold text-right">
              {getSumPaytype("CREDIT")}
            </span>
          </>
        )}
        <Separator className="col-span-2" />
        <span>ยอดขาย</span>
        <span className="font-semibold text-right">
          {posRecentBills
            ?.reduce((acc, bill) => acc + bill.AFTERTAX, 0)
            .toLocaleString("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
        </span>
      </div>
    </div>
  );
}
