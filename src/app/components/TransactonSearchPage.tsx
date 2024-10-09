"use client";
import React, { useContext } from "react";
import TransactionCustomerItems from "./TransactionItems";
import TransactionCustomerBills from "./TransactionBills";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SearchContext, SearchContextType } from "./SearchProvider";

export default function TransactionSearchPage() {
  const { transactionCustomerId, transactionBillId } = useContext(
    SearchContext
  ) as SearchContextType;
  return (
    <main className="h-[85%] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} className="h-full">
          <TransactionCustomerBills
            customerId={transactionCustomerId}
            customerBillNo={transactionBillId}
          />
        </ResizablePanel>
        <ResizableHandle className="p-0.5 m-1 bg-slate-100 " />
        <ResizablePanel className="h-full">
          <TransactionCustomerItems customerId={transactionCustomerId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
