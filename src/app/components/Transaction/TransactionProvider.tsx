"use client";
import React, { useState, createContext } from "react";
import { productType } from "../Product/ProductProvider";
import { supabase } from "@/app/lib/supabase";

export type checkType = {
  BANKNAME: string;
  CHKAMT: number;
  CHKDATE: Date;
  CHKNO: string;
  checkId: number;
  voucherId: string;
};

export type voucherType = {
  voucherId: number;
  VOUCDATE: Date;
  VOUCNO: string;
  BILLAMT: number;
  DISCOUNT: number;
  NETAMT: number;
  CASHAMT: number;
  CHKAMT: number;
  PAYAMT: number;
  accounts: accountsType;
  checks: checkType[];
};

export type noteType = {
  noteId: number;
  NOTEDATE: Date;
  NOTENO: string;
  BILLAMT: number;
  DISCOUNT: number;
  NETAMT: number;
  accounts: accountsType;
};

export type billType = {
  BILLNO: string;
  JOURDATE: Date;
  BILLDATE: Date;
  DEDUCT: number;
  BEFORETAX: number;
  VAT: number;
  AFTERTAX: number;
  accountId: number;
  accounts: accountsType;
  voucherId: number;
  vouchers: voucherType;
  noteId: number;
  notes: noteType;
  REMARKS: string;
};

export type itemsType = {
  BILLNO: string;
  JOURDATE: Date;
  BCODE: string;
  QTY: number;
  UI: string;
  MTP: number;
  DISCNT1: number;
  DISCNT2: number;
  DISCNT3: number;
  DISCNT4: number;
  DED: number;
  VAT: number;
  PRICE: number;
  AMOUNT: number;
  accounts: accountsType;
  bills: billType;
  products: productType;
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
  TERM: number;
  ALLOW: number;
  ATPRICE: number;
  ENDDATE: number;
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
  billType: string;
  setBillType: (type: string) => void;
  //Bills tab state
  accountBills: billType[] | undefined;
  setAccountBills: (notes: billType[]) => void;
  currentBill: billType | undefined;
  setCurrentBill: (note: billType | undefined) => void;
  scrollBill: billType | undefined;
  setScrollBill: (bill: billType | undefined) => void;
  currentBillItems: itemsType[] | undefined;
  setCurrentBillItems: (bills: itemsType[] | undefined) => void;
  getCurrentBillItemsSupabase: (billNo: string) => void;
  //Notes tab state
  accountNotes: noteType[] | undefined;
  setAccountNotes: (notes: noteType[]) => void;
  currentNote: noteType | undefined;
  setCurrentNote: (note: noteType | undefined) => void;
  scrollNote: noteType | undefined;
  setScrollNote: (note: noteType | undefined) => void;
  currentNoteBills: billType[] | undefined;
  setCurrentNoteBills: (bills: billType[]) => void;
  getCurrentNoteBillsSupabase: (noteId: number) => void;
  //Vouchers tab state
  accountVouchers: voucherType[] | undefined;
  setAccountVouchers: (vouchers: voucherType[]) => void;
  currentVoucher: voucherType | undefined;
  setCurrentVoucher: (voucher: voucherType | undefined) => void;
  scrollVoucher: voucherType | undefined;
  setScrollVoucher: (voucher: voucherType | undefined) => void;
  currentVoucherBills: billType[] | undefined;
  setCurrentVoucherBills: (bills: billType[]) => void;
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
  date.setFullYear(date.getFullYear() - 3);
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
  const [billType, setBillType] = useState("1");

  //Bills tab states
  const [accountBills, setAccountBills] = useState<billType[]>();
  const [currentBill, setCurrentBill] = useState<billType>();
  const [scrollBill, setScrollBill] = useState<billType>();
  const [currentBillItems, setCurrentBillItems] = useState<itemsType[]>();
  //Notes tab states
  const [accountNotes, setAccountNotes] = useState<noteType[]>();
  const [currentNote, setCurrentNote] = useState<noteType>();
  const [scrollNote, setScrollNote] = useState<noteType>();
  const [currentNoteBills, setCurrentNoteBills] = useState<billType[]>();
  //Vouchers tab states
  const [accountVouchers, setAccountVouchers] = useState<voucherType[]>();
  const [currentVoucher, setCurrentVoucher] = useState<voucherType>();
  const [scrollVoucher, setScrollVoucher] = useState<voucherType>();
  const [currentVoucherBills, setCurrentVoucherBills] = useState<billType[]>();

  async function getCurrentNoteBillsSupabase(noteId: number) {
    const { data, error } = await supabase
      .from("bills")
      .select(`*, vouchers(*), notes(*)`)
      .eq("noteId", noteId)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) setCurrentNoteBills(data);
  }

  async function getCurrentVoucherBillsSupabase(voucherId: number) {
    const { data, error } = await supabase
      .from("bills")
      .select(`*, vouchers(*), notes(*)`)
      .eq("voucherId", voucherId)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) setCurrentVoucherBills(data);
  }

  async function getCurrentBillItemsSupabase(billNo: string) {
    const { data, error } = await supabase
      .from("items")
      .select(`*, products(*)`)
      .eq("BILLNO", billNo)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) setCurrentBillItems(data);
  }

  function handleClickBill(billNo: string) {
    async function getBillSupabase(billNo: string) {
      const { data, error } = await supabase
        .from("bills")
        .select(`*,  vouchers(*), notes(*), accounts(*)`)
        .eq("BILLNO", billNo)
        .limit(100);

      if (error) return;
      if (data !== null) {
        setCurrentBill(data[0]);
        setScrollBill(data[0]);
      }
    }

    if (!billNo) return;

    getBillSupabase(billNo);
    getCurrentBillItemsSupabase(billNo);
    setCurrentTab("bills");
  }

  function handleClickNote(noteId: number) {
    async function getNoteSupabase(noteId: number) {
      const { data, error } = await supabase
        .from("notes")
        .select(`*, accounts(*)`)
        .eq("noteId", noteId)
        .limit(100);

      if (error) return;
      if (data !== null) {
        setCurrentNote(data[0]);
        setScrollNote(data[0]);
      }
    }

    if (!noteId) return;

    getNoteSupabase(noteId);
    getCurrentNoteBillsSupabase(noteId);
    setCurrentTab("notes");
  }

  function handleClickVoucher(voucherId: number) {
    async function getVoucherSupabase(voucherId: number) {
      const { data, error } = await supabase
        .from("vouchers")
        .select(`*, accounts(*), checks(*)`)
        .eq("voucherId", voucherId)
        .limit(100);

      if (error) return;
      if (data !== null) {
        setCurrentVoucher(data[0]);
        setScrollVoucher(data[0]);
      }
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
    billType,
    setBillType,
    setCurrentTab,
    accountNotes,
    setAccountNotes,
    currentNote,
    setCurrentNote,
    scrollNote,
    setScrollNote,
    currentNoteBills,
    setCurrentNoteBills,
    getCurrentNoteBillsSupabase,
    accountVouchers,
    setAccountVouchers,
    currentVoucher,
    setCurrentVoucher,
    scrollVoucher,
    setScrollVoucher,
    currentVoucherBills,
    setCurrentVoucherBills,
    getCurrentVoucherBillsSupabase,
    accountBills,
    setAccountBills,
    currentBill,
    setCurrentBill,
    scrollBill,
    setScrollBill,
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
