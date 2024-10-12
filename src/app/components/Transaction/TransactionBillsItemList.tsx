import TransactionItemList from "./TransactionItemList";
import { itemsType, billsType } from "./TransactionProvider";

type TransactionBillsItemListProps = {
  currentBillItems: itemsType[] | undefined;
  currentBill: billsType | undefined;
};

export default function TransactionBillsItemList({
  currentBillItems,
  currentBill,
}: TransactionBillsItemListProps) {
  return (
    <>
      {currentBillItems && (
        <div className="w-full overflow-auto text-lg p-4 flex flex-col gap-4">
          {currentBill && (
            <div className="flex gap-4 justify-center">
              <span>บิลเลขที่</span>
              <span className="font-semibold">{currentBill.BILLNO}</span>
              <span>วันที่</span>
              <span className="font-semibold">
                {new Date(currentBill.JOURDATE).toLocaleDateString("th-TH")}
              </span>
            </div>
          )}

          <TransactionItemList currentItems={currentBillItems} />

          {currentBill && (
            <div className="flex justify-end mr-8 text-base mt-auto h-fit">
              <div className="grid grid-cols-2 w-fit justify-end gap-4 border p-4 rounded-lg">
                <span>จำนวนเงิน</span>
                <span className="font-semibold">
                  {parseFloat(
                    currentBill.BEFORETAX ? currentBill.BEFORETAX : "0"
                  ).toLocaleString()}
                </span>
                <span>ภาษี</span>
                <span className="font-semibold">{currentBill.VAT}%</span>
                <span>ยอดรวม</span>
                <span className="font-semibold">
                  {parseFloat(
                    currentBill.AFTERTAX ? currentBill.AFTERTAX : "0"
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
