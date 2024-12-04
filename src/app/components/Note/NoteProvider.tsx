"use client";
import { createContext, useState } from "react";
import React from "react";
import { billType } from "../Transaction/TransactionProvider";
import { itemsType } from "../Transaction/TransactionProvider";

export type NoteContextType = {
  noteBills: billType[] | undefined;
  setNoteBills: (bills: billType[] | undefined) => void;
  noteDate: Date;
  setNoteDate: (date: Date) => void;
  noteDetailOpen: boolean;
  setNoteDetailOpen: (open: boolean) => void;
  purchaseNoteNo: string;
  setPurchaseNoteNo: (noteNo: string) => void;
  currentBill: billType | undefined;
  setCurrentBill: (bill: billType) => void;
  currentBillItems: itemsType[] | undefined;
  setCurrentBillItems: (items: itemsType[]) => void;
  handleRemoveBill: (bill: billType) => void;
  getSumBeforeTax: () => string;
  getSumAfterTax: () => string;
  getSumTax: () => string;
  getSumFullAmount: () => string;
  noteDiscount: string;
  setNoteDiscount: (discount: string) => void;
};

export const NoteContext = createContext<NoteContextType | null>(null);

type NoteProviderProps = {
  children: React.ReactNode;
};

export default function NoteProvider({ children }: NoteProviderProps) {
  const [noteDiscount, setNoteDiscount] = useState("");
  const [noteBills, setNoteBills] = useState<billType[]>();
  const [noteDate, setNoteDate] = useState(new Date());
  const [purchaseNoteNo, setPurchaseNoteNo] = useState("");
  const [noteDetailOpen, setNoteDetailOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<billType>();
  const [currentBillItems, setCurrentBillItems] = useState<itemsType[]>();

  function getSumFullAmount() {
    return !!noteBills
      ? noteBills
          .reduce((acc, bill) => acc + bill.AFTERTAX, 0)
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumBeforeTax() {
    return !!noteBills
      ? noteBills
          .reduce(
            (acc, bill) => acc + bill.BEFORETAX,
            noteDiscount !== "" ? -parseFloat(noteDiscount) : 0
          )
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumAfterTax() {
    return !!noteBills
      ? noteBills
          .reduce(
            (acc, bill) => acc + bill.AFTERTAX,
            noteDiscount !== "" ? -parseFloat(noteDiscount) : 0
          )
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumTax() {
    return !!noteBills
      ? noteBills
          .reduce((acc, bill) => acc + bill.TAX, 0)
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function handleRemoveBill(bill: billType) {
    const newNoteBills = noteBills?.filter(
      (noteBill) => noteBill.billId != bill.billId
    );
    setNoteBills(newNoteBills);
    setNoteDetailOpen(false);
  }

  const value = {
    noteBills,
    setNoteBills,
    noteDate,
    setNoteDate,
    purchaseNoteNo,
    setPurchaseNoteNo,
    noteDetailOpen,
    setNoteDetailOpen,
    currentBill,
    setCurrentBill,
    currentBillItems,
    setCurrentBillItems,
    handleRemoveBill,
    getSumBeforeTax,
    getSumAfterTax,
    getSumTax,
    getSumFullAmount,
    noteDiscount,
    setNoteDiscount,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}
