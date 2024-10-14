"use client";
import React, { useContext, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchContext, SearchContextType } from "../SearchProvider";
import { usePathname } from "next/navigation";
import TransactionFilter from "./TransactionFilter";
import TransactionItems from "./TransactionItems";
import TransactionBills from "./TransactionBills";
import TransactionNotes from "./TransactionNotes";
import TransactionVouchers from "./TransactionVouchers";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";

export default function TransactionSearchPage() {
  const { transactionAccountObject } = useContext(
    SearchContext
  ) as SearchContextType;

  const {
    setCurrentTab,
    currentTab,
    setCurrentBill,
    setCurrentNote,
    setCurrentVoucher,
    setCurrentBillItems,
  } = useContext(TransactionContext) as TransactionContextType;

  const accountId = transactionAccountObject
    ? transactionAccountObject.accountId.toString()
    : "";

  useEffect(() => {
    setCurrentBill(undefined);
    setCurrentNote(undefined);
    setCurrentVoucher(undefined);
    setCurrentBillItems(undefined);
  }, [transactionAccountObject]);

  const path = usePathname();
  const acctType = path === "/sales" ? "S" : path === "/purchases" ? "P" : "";

  return (
    <main className="h-[85%] w-full">
      <Tabs
        defaultValue="allItems"
        value={currentTab}
        onValueChange={setCurrentTab}
      >
        <div className="flex justify-center items-center py-2 bg-gray-100 px-16">
          <div className="flex-1 flex gap-2">
            <span
              className={`font-semibold text-xl text-white px-1 rounded-md ${
                transactionAccountObject?.ACCTTYPE === "P"
                  ? "bg-red-900"
                  : transactionAccountObject?.ACCTTYPE === "S"
                  ? "bg-green-900"
                  : "bg-primary"
              }`}
            >
              {transactionAccountObject?.ACCTNO}
            </span>
            <span className="font-semibold text-xl">
              {transactionAccountObject?.ACCTNAME}
            </span>
          </div>
          <TabsList>
            <TabsTrigger value="allItems">ดูสินค้าทั้งหมด</TabsTrigger>
            <TabsTrigger value="bills">{`${
              acctType === "P" ? "บิลซื้อ" : "บิลขาย"
            }`}</TabsTrigger>
            <TabsTrigger value="notes">วางบิล</TabsTrigger>
            <TabsTrigger value="vouchers">{`${
              acctType === "P" ? "ใบสำคัญจ่าย" : "ใบสำคัญรับ"
            }`}</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TransactionFilter />
          </div>
        </div>

        <TabsContent value="allItems">
          {accountId !== "" && <TransactionItems accountId={accountId} />}
        </TabsContent>
        <TabsContent value="bills">
          {accountId !== "" && <TransactionBills accountId={accountId} />}
        </TabsContent>
        <TabsContent value="notes">
          {accountId !== "" && <TransactionNotes accountId={accountId} />}
        </TabsContent>
        <TabsContent value="vouchers">
          {accountId !== "" && <TransactionVouchers accountId={accountId} />}
        </TabsContent>
      </Tabs>
    </main>
  );
}
