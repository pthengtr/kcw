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
  _account: accountsType;
};

export type noteType = {
  voucherId: number;
  NOTEDATE: string;
  NOTENO: string;
  BILLAMT: string;
  DISCOUNT: string;
  NETAMT: string;
  _account: accountsType;
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
};

export const TransactionContext = createContext<TransactionContextType | null>(
  null
);

type TransactionProvider = {
  children: React.ReactNode;
};

export default function TransactionProvider({ children }: TransactionProvider) {
  const [accountId, setAccountId] = React.useState("");
  const [billNo, setBillNo] = React.useState("");

  const value = {
    accountId,
    setAccountId,
    billNo,
    setBillNo,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
