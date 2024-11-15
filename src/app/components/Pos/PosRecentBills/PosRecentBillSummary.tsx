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
  function getSumPaytype(paytype: string, vattype: string = "ALL") {
    return _getSumPaytype(paytype, vattype)?.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function _getSumPaytype(paytype: string, vattype: string = "ALL") {
    if (!posRecentBills) return;

    const sumBills =
      vattype === "ALL"
        ? posRecentBills
        : vattype === "VAT"
        ? posRecentBills.filter((bill) => bill.TAX !== 0)
        : posRecentBills.filter((bill) => bill.TAX === 0);

    if (paytype === "CREDIT") {
      return sumBills.reduce(
        (acc, bill) =>
          acc +
          (!!bill.bill_payment
            ? bill.bill_payment.reduce(
                (acc, payment) =>
                  payment.PAYTYPE !== "VOUCHER" ? acc - payment.AMOUNT : acc,
                bill.AFTERTAX
              )
            : 0),
        0
      );
    } else {
      const paytypeBills = sumBills.filter(
        (bill) =>
          bill.bill_payment?.filter((payment) => payment.PAYTYPE === paytype)
            .length != 0
      );
      return paytypeBills.reduce(
        (acc, bill) =>
          acc +
          (!!bill.bill_payment
            ? bill.bill_payment.reduce(
                (acc, payment) => acc + payment.AMOUNT,
                0
              )
            : 0),
        0
      );
    }
  }

  return (
    <div className="flex gap-12 justify-center mx-4 items-center">
      <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2 p-4 w-fit border rounded-md h-fit">
        <span>บิลที่แสดง</span>
        <span className="font-semibold text-right">
          {posFilterRecentBills?.length}
        </span>
        <span>บิลทั้งหมด</span>
        <span className="font-semibold text-right">
          {posRecentBills?.length}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p>สรุปยอดขายประจำวัน</p>
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-4 gap-y-2 p-4 w-fit border rounded-md h-fit">
          <span>{/*place holder*/}</span>
          <span className="text-center">ทั้งหมด</span>
          <span className="text-center">VAT</span>
          <span className="text-center">ไม่ VAT</span>
          <Separator className="col-span-4" />
          {_getSumPaytype("CASH") !== 0 && (
            <>
              <span>เงินสด</span>
              <span className="font-semibold text-right">
                {getSumPaytype("CASH")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("CASH", "VAT")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("CASH", "NOVAT")}
              </span>
            </>
          )}

          {_getSumPaytype("TRANSFER") !== 0 && (
            <>
              <span>โอน</span>
              <span className="font-semibold text-right">
                {getSumPaytype("TRANSFER")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("TRANSFER", "VAT")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("TRANSFER", "NOVAT")}
              </span>
            </>
          )}

          {_getSumPaytype("CHECK") !== 0 && (
            <>
              <span>เช็ค</span>
              <span className="font-semibold text-right">
                {getSumPaytype("CHECK")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("CHECK", "VAT")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("CHECK", "NOVAT")}
              </span>
            </>
          )}

          {_getSumPaytype("CREDIT") !== 0 && (
            <>
              <span>ลงบัญชี</span>
              <span className="font-semibold text-right">
                {getSumPaytype("CREDIT")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("CREDIT", "VAT")}
              </span>
              <span className="font-semibold text-right">
                {getSumPaytype("CREDIT", "NOVAT")}
              </span>
            </>
          )}
          <Separator className="col-span-4" />
          <span>ยอดขาย</span>
          <span className="font-semibold text-right">
            {posRecentBills
              ?.reduce((acc, bill) => acc + bill.AFTERTAX, 0)
              .toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
          <span className="font-semibold text-right">
            {posRecentBills
              ?.filter((bill) => bill.TAX !== 0)
              .reduce((acc, bill) => acc + bill.AFTERTAX, 0)
              .toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
          <span className="font-semibold text-right">
            {posRecentBills
              ?.filter((bill) => bill.TAX === 0)
              .reduce((acc, bill) => acc + bill.AFTERTAX, 0)
              .toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>
    </div>
  );
}
