"use client";
import React, { useState, createContext } from "react";
import { ItemDetailType } from "../ProductDetail";
import { supabase } from "@/app/lib/supabase";

export type voucherType = {
  voucherId: number;
  VOUCDATE: string;
  VOUCNO: string;
  BILLAMT: string;
  DISCOUNT: string;
  NETAMT: string;
  CASHAMT: string;
  CHKAMT: string;
  PAYAMT: string;
  _accounts: accountsType;
};

export type noteType = {
  noteId: number;
  NOTEDATE: string;
  NOTENO: string;
  BILLAMT: string;
  DISCOUNT: string;
  NETAMT: string;
  _accounts: accountsType;
};

export type billsType = {
  BILLNO: string;
  JOURDATE: Date;
  BILLDATE: string;
  DEDUCT: string;
  BEFORETAX: string;
  VAT: string;
  AFTERTAX: string;
  CASHAMT: string;
  CHKAMT: string;
  DUEAMT: string;
  accountId: number;
  _accounts: accountsType;
  voucherId: number;
  _vouchers: voucherType;
  noteId: number;
  _notes: noteType;
  salesItems: itemsType;
};

export type itemsType = {
  BILLNO: string;
  JOURDATE: string;
  BCODE: string;
  QTY: string;
  UI: string;
  MTP: string;
  DISCNT1: string;
  DISCNT2: string;
  DISCNT3: string;
  DISCNT4: string;
  PRICE: string;
  AMOUNT: string;
  _accounts: accountsType;
  _bills: billsType;
  productInfo: ItemDetailType;
};

export type accountsType = {
  accountId: number;
  ACCTNO: string;
  ACCTTYPE: "P" | "S";
  ACCTNAME: string;
  ADDR1: string;
  ADDR2: string;
  PHONE: string;
  MOBILE: string;
  FAX: string;
  CONTACT: string;
  EMAIL: string;
  TERM: string;
  ALLOW: string;
  ATPRICE: string;
  ENDDATE: string;
  REMARKS: string;
};

export type TransactionContextType = {
  billNo: string;
  setBillNo: (bill: string) => void;
  accountId: string;
  setAccountId: (key: string) => void;
  filterText: string;
  setFilterText: (filterText: string) => void;
  toDate: Date;
  setToDate: (toDate: Date) => void;
  fromDate: Date;
  setFromDate: (fromDate: Date) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  //Bills tab state
  accountBills: billsType[] | undefined;
  setAccountBills: (notes: billsType[]) => void;
  currentBill: billsType | undefined;
  setCurrentBill: (note: billsType | undefined) => void;
  currentBillItems: itemsType[] | undefined;
  setCurrentBillItems: (bills: itemsType[] | undefined) => void;
  getCurrentBillItemsSupabase: (billNo: string) => void;
  //Notes tab state
  accountNotes: noteType[] | undefined;
  setAccountNotes: (notes: noteType[]) => void;
  currentNote: noteType | undefined;
  setCurrentNote: (note: noteType | undefined) => void;
  currentNoteBills: billsType[] | undefined;
  setCurrentNoteBills: (bills: billsType[]) => void;
  getCurrentNoteBillsSupabase: (noteId: number) => void;
  //Vouchers tab state
  accountVouchers: voucherType[] | undefined;
  setAccountVouchers: (vouchers: voucherType[]) => void;
  currentVoucher: voucherType | undefined;
  setCurrentVoucher: (voucher: voucherType | undefined) => void;
  currentVoucherBills: billsType[] | undefined;
  setCurrentVoucherBills: (bills: billsType[]) => void;
  getCurrentVoucherBillsSupabase: (voucherId: number) => void;
  handleClickNote: (noteId: number) => void;
  handleClickVoucher: (voucherId: number) => void;
  handleClickBill: (billNo: string) => void;
};

export const TransactionContext = createContext<TransactionContextType | null>(
  null
);

export function createLastYearDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

type TransactionProvider = {
  children: React.ReactNode;
};

export default function TransactionProvider({ children }: TransactionProvider) {
  const [accountId, setAccountId] = useState("");
  const [billNo, setBillNo] = useState("");
  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date>(createLastYearDate());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [currentTab, setCurrentTab] = useState("allItems");
  //Bills tab states
  const [accountBills, setAccountBills] = useState<billsType[]>();
  const [currentBill, setCurrentBill] = useState<billsType>();
  const [currentBillItems, setCurrentBillItems] = useState<itemsType[]>();
  //Notes tab states
  const [accountNotes, setAccountNotes] = useState<noteType[]>();
  const [currentNote, setCurrentNote] = useState<noteType>();
  const [currentNoteBills, setCurrentNoteBills] = useState<billsType[]>();
  //Vouchers tab states
  const [accountVouchers, setAccountVouchers] = useState<voucherType[]>();
  const [currentVoucher, setCurrentVoucher] = useState<voucherType>();
  const [currentVoucherBills, setCurrentVoucherBills] = useState<billsType[]>();

  async function getCurrentNoteBillsSupabase(noteId: number) {
    const { data, error } = await supabase
      .from("_bills")
      .select(`*, _vouchers(*), _notes(*)`)
      .eq("noteId", noteId)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) setCurrentNoteBills(data);
  }

  async function getCurrentVoucherBillsSupabase(voucherId: number) {
    const { data, error } = await supabase
      .from("_bills")
      .select(`*, _vouchers(*), _notes(*)`)
      .eq("voucherId", voucherId)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) setCurrentVoucherBills(data);
  }

  async function getCurrentBillItemsSupabase(billNo: string) {
    const { data, error } = await supabase
      .from("_items")
      .select(`*, productInfo(*)`)
      .eq("BILLNO", billNo)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) setCurrentBillItems(data);
  }

  function handleClickBill(billNo: string) {
    async function getBillSupabase(billNo: string) {
      const { data, error } = await supabase
        .from("_bills")
        .select(`*,  _vouchers(*), _notes(*)`)
        .eq("BILLNO", billNo)
        .limit(100);

      if (error) return;
      if (data !== null) setCurrentBill(data[0]);
    }

    if (!billNo) return;

    getBillSupabase(billNo);
    getCurrentBillItemsSupabase(billNo);
    setCurrentTab("bills");
  }

  function handleClickNote(noteId: number) {
    async function getNoteSupabase(noteId: number) {
      const { data, error } = await supabase
        .from("_notes")
        .select(`*, _accounts(*)`)
        .eq("noteId", noteId)
        .limit(100);

      if (error) return;
      if (data !== null) setCurrentNote(data[0]);
    }

    if (!noteId) return;

    getNoteSupabase(noteId);
    getCurrentNoteBillsSupabase(noteId);
    setCurrentTab("notes");
  }

  function handleClickVoucher(voucherId: number) {
    async function getVoucherSupabase(voucherId: number) {
      const { data, error } = await supabase
        .from("_vouchers")
        .select(`*, _accounts(*)`)
        .eq("voucherId", voucherId)
        .limit(100);

      if (error) return;
      if (data !== null) setCurrentVoucher(data[0]);
    }

    if (!voucherId) return;

    getVoucherSupabase(voucherId);
    getCurrentVoucherBillsSupabase(voucherId);
    setCurrentTab("vouchers");
  }

  const value = {
    accountId,
    setAccountId,
    billNo,
    setBillNo,
    filterText,
    setFilterText,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    currentTab,
    setCurrentTab,
    accountNotes,
    setAccountNotes,
    currentNote,
    setCurrentNote,
    currentNoteBills,
    setCurrentNoteBills,
    getCurrentNoteBillsSupabase,
    accountVouchers,
    setAccountVouchers,
    currentVoucher,
    setCurrentVoucher,
    currentVoucherBills,
    setCurrentVoucherBills,
    getCurrentVoucherBillsSupabase,
    accountBills,
    setAccountBills,
    currentBill,
    setCurrentBill,
    currentBillItems,
    setCurrentBillItems,
    getCurrentBillItemsSupabase,
    handleClickNote,
    handleClickVoucher,
    handleClickBill,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
