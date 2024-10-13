"use client";
import { createContext } from "react";
import React from "react";
import { ItemDetailType } from "../ProductDetail";

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
  customerId: number;
  _accounts: accountsType;
  _vouchers: voucherType;
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
  const [accountId, setAccountId] = React.useState("");
  const [billNo, setBillNo] = React.useState("");
  const [filterText, setFilterText] = React.useState("");
  const [fromDate, setFromDate] = React.useState<Date>(createLastYearDate());
  const [toDate, setToDate] = React.useState<Date>(new Date());
  const [currentTab, setCurrentTab] = React.useState("allItems");

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
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
