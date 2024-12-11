"use client";
import React, { useContext, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import TransactionFilter from "./TransactionFilter";
import TransactionItems from "./TransactionItems";
import TransactionBills from "./TransactionBills";
import TransactionNotes from "./TransactionNotes";
import TransactionVouchers from "./TransactionVouchers";
import {
  accountsType,
  createPreviousYearDate,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";

import SelectAcount from "../Common/SelectAccount";

export default function TransactionSearchPage() {
  const {
    setCurrentTab,
    currentTab,
    setCurrentBill,
    setCurrentNote,
    setCurrentVoucher,
    setCurrentBillItems,
    setScrollBill,
    currentBill,
    setScrollNote,
    currentNote,
    setScrollVoucher,
    currentVoucher,
    setToDate,
    setFromDate,
    setFilterText,
    currentAccount,
    setCurrentAccount,
  } = useContext(TransactionContext) as TransactionContextType;

  const accountId = currentAccount ? currentAccount.accountId.toString() : "";

  useEffect(() => {
    setCurrentBill(undefined);
    setCurrentNote(undefined);
    setCurrentVoucher(undefined);
    setCurrentBillItems(undefined);
    setFilterText("");
    setToDate(new Date());
    setFromDate(createPreviousYearDate(3));
  }, [
    setCurrentBill,
    setCurrentNote,
    setCurrentVoucher,
    setCurrentBillItems,
    currentAccount,
    setFilterText,
    setToDate,
    setFromDate,
  ]);

  const path = usePathname();
  const acctType = path === "/customer" ? "S" : path === "/supplier" ? "P" : "";

  function handleOnTabChange(value: string) {
    setCurrentTab(value);
    setFilterText("");
    setToDate(new Date());
    setFromDate(createPreviousYearDate(3));
  }

  function handleAccountChange(account: accountsType) {
    setCurrentAccount(account);
  }

  return (
    <main className="h-[85%] w-full">
      <Tabs
        defaultValue="allItems"
        value={currentTab}
        onValueChange={handleOnTabChange}
      >
        <div className="flex justify-center items-center py-2 bg-gray-100 px-16">
          <div className="flex-1 flex gap-2 items-center">
            <SelectAcount
              currentCustomer={currentAccount}
              handleSelectCustomer={handleAccountChange}
            />
          </div>
          <TabsList>
            <TabsTrigger value="allItems">ดูสินค้าทั้งหมด</TabsTrigger>
            <TabsTrigger
              onClick={() => setScrollBill(currentBill)}
              value="bills"
            >{`${acctType === "P" ? "บิลซื้อ" : "บิลขาย"}`}</TabsTrigger>
            <TabsTrigger
              onClick={() => setScrollNote(currentNote)}
              value="notes"
            >
              วางบิล
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setScrollVoucher(currentVoucher)}
              value="vouchers"
            >{`${
              acctType === "P" ? "ใบสำคัญจ่าย" : "ใบสำคัญรับ"
            }`}</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TransactionFilter />
          </div>
        </div>

        <TabsContent value="allItems">
          {accountId !== "" && <TransactionItems />}
        </TabsContent>
        <TabsContent value="bills">
          {accountId !== "" && <TransactionBills />}
        </TabsContent>
        <TabsContent value="notes">
          {accountId !== "" && <TransactionNotes />}
        </TabsContent>
        <TabsContent value="vouchers">
          {accountId !== "" && <TransactionVouchers />}
        </TabsContent>
      </Tabs>
    </main>
  );
}
