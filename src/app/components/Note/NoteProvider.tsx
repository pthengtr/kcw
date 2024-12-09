"use client";
import { createContext, useState } from "react";
import React from "react";
import { accountsType, billType } from "../Transaction/TransactionProvider";
import { itemsType } from "../Transaction/TransactionProvider";
import { supabase } from "@/app/lib/supabase";

export type NoteContextType = {
  noteBills: billType[] | undefined;
  setNoteBills: (bills: billType[] | undefined) => void;
  noteDueDate: Date;
  setNoteDueDate: (date: Date) => void;
  noteDetailOpen: boolean;
  setNoteDetailOpen: (open: boolean) => void;
  purchaseNoteNo: string;
  setPurchaseNoteNo: (noteNo: string) => void;
  currentBill: billType | undefined;
  setCurrentBill: (bill: billType) => void;
  currentBillItems: itemsType[] | undefined;
  setCurrentBillItems: (items: itemsType[]) => void;
  currentAccount: accountsType | undefined;
  setCurrentAccount: (account: accountsType | undefined) => void;
  handleRemoveBill: (bill: billType) => void;
  handleAddBill: (bill: billType) => void;
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
  const [noteDueDate, setNoteDueDate] = useState(new Date());
  const [purchaseNoteNo, setPurchaseNoteNo] = useState("");
  const [noteDetailOpen, setNoteDetailOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<billType>();
  const [currentBillItems, setCurrentBillItems] = useState<itemsType[]>();
  const [currentAccount, setCurrentAccount] = useState<accountsType>();

  function getSumFullAmount(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
          .reduce((acc, bill) => acc + bill.AFTERTAX, 0)
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumBeforeTax(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
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

  function getSumAfterTax(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
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

  function getSumTax(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
          .reduce((acc, bill) => acc + bill.TAX, 0)
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function handleAddBill(bill: billType) {
    const newNoteBills =
      noteBills !== undefined ? [...noteBills, bill] : [bill];

    if (!!bill.accountId) {
      getAccountSupabase(bill.accountId.toString());
    }
    setNoteBills(newNoteBills);
  }

  function handleRemoveBill(bill: billType) {
    const newNoteBills = noteBills?.filter(
      (noteBill) => noteBill.billId != bill.billId
    );

    if (newNoteBills?.length === 0) {
      setCurrentAccount(undefined);
    }
    setNoteBills(newNoteBills);
    setNoteDetailOpen(false);
  }

  async function getAccountSupabase(accountId: string) {
    const { data, error } = await supabase
      .from("accounts")
      .select(`*`)
      .eq("accountId", accountId)
      .limit(1);

    if (error) return;
    if (data !== null) setCurrentAccount(data[0]);
  }

  const value = {
    noteBills,
    setNoteBills,
    noteDueDate,
    setNoteDueDate,
    purchaseNoteNo,
    setPurchaseNoteNo,
    noteDetailOpen,
    setNoteDetailOpen,
    currentBill,
    setCurrentBill,
    currentBillItems,
    setCurrentBillItems,
    currentAccount,
    setCurrentAccount,
    handleRemoveBill,
    handleAddBill,
    getSumBeforeTax,
    getSumAfterTax,
    getSumTax,
    getSumFullAmount,
    noteDiscount,
    setNoteDiscount,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}
