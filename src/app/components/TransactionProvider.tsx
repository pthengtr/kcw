"use client";
import { createContext } from "react";
import React from "react";

export type TransactionContextType = {
  billNo: string;
  setBillNo: (bill: string) => void;
  customerId: string;
  setCustomerId: (key: string) => void;
};

export const TransactionContext = createContext<TransactionContextType | null>(
  null
);

type TransactionProvider = {
  children: React.ReactNode;
};

export default function TransactionProvider({ children }: TransactionProvider) {
  const [customerId, setCustomerId] = React.useState("");
  const [billNo, setBillNo] = React.useState("");

  const value = {
    customerId,
    setCustomerId,
    billNo,
    setBillNo,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
