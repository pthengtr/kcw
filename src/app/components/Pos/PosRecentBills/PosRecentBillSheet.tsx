import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/app/lib/supabase";

import { useEffect, useState } from "react";
import { billType, itemsType } from "../../Transaction/TransactionProvider";
import TransactionBillsItemList from "../../Transaction/TransactionBillsItemList";
import PosRecentBillSummary from "./PosRecentBillSummary";
import PosRecentBillFilter from "./PosRecentBillFilter";
import PosRecentBillsTable from "./PosRecentBillsTable";

export type paymentFilterType = {
  filterText: string;
  cash: boolean;
  transfer: boolean;
  check: boolean;
  credit: boolean;
  vat: boolean;
  novat: boolean;
};

const initialPaymentFilter = {
  filterText: "",
  cash: true,
  transfer: true,
  check: true,
  credit: true,
  vat: true,
  novat: true,
};

export default function PosRecentBillSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [billDate, setBillDate] = useState(new Date());
  const [paymentFilter, setPaymentFilter] =
    useState<paymentFilterType>(initialPaymentFilter);
  const [posCurrentRecentBill, setCurrentRecentBill] = useState<
    billType | undefined
  >();
  const [posRecentBills, setPosRecentBills] = useState<
    billType[] | undefined
  >();
  const [posFilterRecentBills, setPosFilterRecentBills] = useState<
    billType[] | undefined
  >();
  const [posRecentBillItems, setPosRecentBillItems] = useState<
    itemsType[] | undefined
  >();

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error } = await supabase
        .from("bills")
        .select(`*, vouchers(*), notes(*), accounts(*), bill_payment(*)`, {
          count: "exact",
        })
        .ilike("BILLTYPE", `1S%`)
        .order("JOURDATE", { ascending: false })
        .lte(
          "JOURDATE",
          new Date(
            `${billDate.getFullYear()}-${
              billDate.getMonth() + 1
            }-${billDate.getDate()} 23:59:59`
          ).toLocaleString("en-US")
        )
        .gte(
          "JOURDATE",
          new Date(
            `${billDate.getFullYear()}-${
              billDate.getMonth() + 1
            }-${billDate.getDate()} 00:00:00`
          ).toLocaleString("en-US")
        )
        .limit(500);

      console.log("rerender");

      if (error) return;
      if (data !== null) {
        setPosRecentBills(data);
        setPaymentFilter(initialPaymentFilter);
        filterRecentBills(initialPaymentFilter, data);
      }
    }

    if (isOpen) getBillsSupabase();
  }, [isOpen, billDate, setPosRecentBills, setPosFilterRecentBills]);

  async function getBillItemsSupabase(billId: string) {
    const { data, error } = await supabase
      .from("items")
      .select(`*, bills(*), products(*)`, { count: "exact" })
      .eq("billId", billId)
      .order("JOURDATE", { ascending: false })
      .limit(50);

    if (error) return;
    if (data !== null) setPosRecentBillItems(data);
  }

  function handleClickRecentBill(bill: billType) {
    getBillItemsSupabase(bill.billId.toString());
    setCurrentRecentBill(bill);
  }

  function handleSheetOpen(open: boolean) {
    setIsOpen(open);
    if (open) {
      setBillDate(new Date());
      setCurrentRecentBill(undefined);
      setPosRecentBillItems(undefined);
      setPaymentFilter(initialPaymentFilter);
    }
  }

  function handleFilterChange(filter: paymentFilterType) {
    setPaymentFilter(filter);

    if (!!posRecentBills) {
      filterRecentBills(filter, posRecentBills);
    }
  }

  function filterRecentBills(filter: paymentFilterType, bills: billType[]) {
    //Filter payment type
    let newPosRecentBills = bills.filter(
      (bill) =>
        bill.bill_payment?.filter(
          (payment) =>
            (filter.cash && payment.PAYTYPE === "CASH") ||
            (filter.transfer && payment.PAYTYPE === "TRANSFER") ||
            (filter.check && payment.PAYTYPE === "CHECK") ||
            (filter.credit && payment.PAYTYPE === "VOUCHER")
        ).length != 0
    );

    newPosRecentBills = filter.credit
      ? [
          ...newPosRecentBills,
          ...bills.filter(
            (bill) =>
              bill.bill_payment?.reduce(
                (acc, payment) => acc - payment.AMOUNT,
                bill.AFTERTAX
              ) !== 0 || bill.bill_payment.length === 0
          ),
        ]
      : newPosRecentBills;

    newPosRecentBills =
      filter.filterText !== ""
        ? newPosRecentBills.filter(
            (bill) =>
              bill.BILLNO.includes(filter.filterText) ||
              bill.accounts?.ACCTNAME.includes(filter.filterText) ||
              bill.accounts?.ACCTNO.includes(filter.filterText)
          )
        : newPosRecentBills;

    newPosRecentBills = newPosRecentBills.filter(
      (bill) =>
        (filter.vat && bill.TAX !== 0) || (filter.novat && bill.TAX === 0)
    );

    setPosFilterRecentBills(newPosRecentBills);
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger className="w-full">รายการบิลขายประจำวัน</SheetTrigger>
      <SheetContent className="sm:max-w-full grid grid-cols-2">
        {posFilterRecentBills && (
          <div className="h-full overflow-auto flex flex-col gap-4">
            {/* Filter section */}
            <PosRecentBillFilter
              paymentFilter={paymentFilter}
              handleFilterChange={handleFilterChange}
              billDate={billDate}
              setBillDate={setBillDate}
            />
            {/* Table section */}
            <PosRecentBillsTable
              posFilterRecentBills={posFilterRecentBills}
              posCurrentRecentBill={posCurrentRecentBill}
              handleClickRecentBill={handleClickRecentBill}
            />
            {/* Summary section */}
            <PosRecentBillSummary
              posFilterRecentBills={posFilterRecentBills}
              posRecentBills={posRecentBills}
            />
          </div>
        )}

        {!!posRecentBillItems && (
          <div className="h-[90vh]">
            <TransactionBillsItemList
              currentBillItems={posRecentBillItems}
              currentBill={posCurrentRecentBill}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
