"use client";
import React, { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchContext, SearchContextType } from "../SearchProvider";
import TransactionFilter from "./TransactionFilter";
import TransactionItems from "./TransactionItems";
import TransactionBills from "./TransactionBills";

export default function TransactionSearchPage() {
  const { transactionAccountObject } = useContext(
    SearchContext
  ) as SearchContextType;

  return (
    <main className="h-[85%] w-full">
      <Tabs defaultValue="allItems">
        <div className="flex justify-center items-center py-2 bg-gray-100 px-16">
          <div className="flex-1 flex gap-2">
            <span
              className={`font-semibold text-xl text-white px-1 rounded-md ${
                transactionAccountObject?.ACCTNO.slice(-1) === "P"
                  ? "bg-red-900"
                  : transactionAccountObject?.ACCTNO.slice(-1) === "S"
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
          <TabsList className="">
            <TabsTrigger value="allItems">ดูสินค้าทั้งหมด</TabsTrigger>
            <TabsTrigger value="bills">บิลซื้อ-ขาย</TabsTrigger>
            <TabsTrigger value="notes">วางบิล</TabsTrigger>
            <TabsTrigger value="vouchers">ใบสำคัญรับ-จ่าย</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TransactionFilter />
          </div>
        </div>

        <TabsContent value="allItems">
          {transactionAccountObject !== undefined && (
            <TransactionItems
              accountId={transactionAccountObject.accountId.toString()}
            />
          )}
        </TabsContent>
        <TabsContent value="bills">
          {transactionAccountObject !== undefined && (
            <TransactionBills
              accountId={transactionAccountObject.accountId.toString()}
            />
          )}
        </TabsContent>
        <TabsContent value="notes">Notes</TabsContent>
        <TabsContent value="vouchers">Vouchers</TabsContent>
      </Tabs>
    </main>
  );
}
