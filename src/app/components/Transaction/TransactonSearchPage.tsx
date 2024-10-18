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
  createLastYearDate,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const accountInfo = {
  ADDR1: "ที่อยู่",
  PHONE: "โทรศัพท์",
  MOBILE: "เลขประจำตัวผู้เสียภาษี",
  FAX: "แฟกซ์",
  CONTACT: "ติดต่อ",
  EMAIL: "อีเมล",
  TERM: "เครดิต",
  ALLOW: "วงเงิน",
  REMARKS: "หมายเหตุ",
};

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
    setScrollBill,
    currentBill,
    setScrollNote,
    currentNote,
    setScrollVoucher,
    currentVoucher,
    setToDate,
    setFromDate,
    setFilterText,
  } = useContext(TransactionContext) as TransactionContextType;

  const accountId = transactionAccountObject
    ? transactionAccountObject.accountId.toString()
    : "";

  useEffect(() => {
    setCurrentBill(undefined);
    setCurrentNote(undefined);
    setCurrentVoucher(undefined);
    setCurrentBillItems(undefined);
    setFilterText("");
    setToDate(new Date());
    setFromDate(createLastYearDate());
  }, [
    setCurrentBill,
    setCurrentNote,
    setCurrentVoucher,
    setCurrentBillItems,
    transactionAccountObject,
    setFilterText,
    setToDate,
    setFromDate,
  ]);

  const path = usePathname();
  const acctType = path === "/sales" ? "S" : path === "/purchases" ? "P" : "";

  function handleOnTabChange(value: string) {
    setCurrentTab(value);
    setFilterText("");
    setToDate(new Date());
    setFromDate(createLastYearDate());
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
            {transactionAccountObject && (
              <Popover>
                <PopoverTrigger>
                  <div className="flex gap-2">
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
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-[auto_auto] w-full max-w-[500px] gap-x-6 gap-y-2">
                  {Object.keys(accountInfo).map((key) => (
                    <React.Fragment key={key}>
                      {!!transactionAccountObject[
                        key as keyof typeof accountInfo
                      ] && (
                        <>
                          <span className="text-gray-500">
                            {accountInfo[key as keyof typeof accountInfo]}
                          </span>
                          <span>
                            {`${
                              transactionAccountObject[
                                key as keyof typeof accountInfo
                              ]
                            }  ${
                              key === "ADDR1"
                                ? transactionAccountObject.ADDR2
                                : ""
                            }`}
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </PopoverContent>
              </Popover>
            )}
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
