import React from "react";
import { noteType, billType } from "./TransactionProvider";
import TransactionBillList from "./TransactionBillList";

type TransactionNotesBillListProps = {
  currentNote: noteType;
  currentNoteBills: billType[] | undefined;
};

export default function TransactionNotesBillList({
  currentNote,
  currentNoteBills,
}: TransactionNotesBillListProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex gap-4 justify-center text-lg">
        <span>ใบวางบิลเลขที่</span>
        <span className="font-semibold">{currentNote.NOTENO}</span>
        <span>วันที่</span>
        <span className="font-semibold">
          {new Date(currentNote.NOTEDATE).toLocaleDateString("th-TH")}
        </span>
      </div>
      <TransactionBillList
        currentBills={currentNoteBills}
        mode="notes"
        acctType={currentNote.accounts.ACCTTYPE}
      />

      {currentNote && (
        <div className="flex justify-end pb-16 px-16 text-base mt-auto  h-fit">
          <div className="grid grid-cols-2 w-fit justify-end gap-4 border p-4 rounded-lg">
            <span>จำนวนเงิน</span>
            <span className="font-semibold">
              {currentNote.BILLAMT.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span>ส่วนลด</span>
            <span className="font-semibold">
              {currentNote.DISCOUNT.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span>ยอดรวม</span>
            <span className="font-semibold">
              {currentNote.NETAMT.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
