"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/app/lib/supabase";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { billType, itemsType } from "../Transaction/TransactionProvider";
import TransactionBillsItemList from "../Transaction/TransactionBillsItemList";
import { Input } from "@/components/ui/input";
import DateRange from "../Common/DateRange";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { createPreviousYearDate } from "../Transaction/TransactionProvider";
import NoteBillsTable from "./NoteBillsTable";
import { NoteContext, NoteContextType } from "./NoteProvider";

export default function BillSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [bills, setBills] = useState<billType[]>();
  const [currentBill, setCurrentBill] = useState<billType>();
  const [billItems, setBillItems] = useState<itemsType[]>();
  const [filterText, setFilterText] = useState("");
  const [toDate, setToDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(createPreviousYearDate(1));
  const [unpaidOnly, setUnpaidOnly] = useState(true);
  const [maxSearch, setMaxSearch] = useState("50");

  const {
    handleAddBill,
    handleRemoveBill,
    noteBills: selectedBills,
    currentAccount,
  } = useContext(NoteContext) as NoteContextType;

  const pathName = usePathname();

  const currentAccountId = currentAccount?.accountId;
  const currentAccountName = currentAccount?.ACCTNAME;

  async function getBillItemsSupabase(billId: string) {
    const { data, error } = await supabase
      .from("items")
      .select(`*, bills(*), products(*)`, { count: "exact" })
      .eq("billId", billId)
      .order("JOURDATE", { ascending: false })
      .limit(50);

    if (error) return;
    if (data !== null) setBillItems(data);
  }

  function handleClickBill(bill: billType) {
    getBillItemsSupabase(bill.billId.toString());
    setCurrentBill(bill);
  }

  function handleSheetOpen(open: boolean) {
    setIsOpen(open);
    if (open) {
      setFilterText("");
      setToDate(new Date());
      setFromDate(createPreviousYearDate(1));
      setMaxSearch("50");
      setCurrentBill(undefined);
      setBillItems(undefined);
    }
  }

  useEffect(() => {
    async function getBillsSupabase() {
      let query = supabase
        .from("bills")
        .select(
          `*, vouchers(*), notes(*), accounts!inner(*), bill_payment(*)`,
          {
            count: "exact",
          }
        )
        .ilike("BILLTYPE", `${pathName === "/sale-note" ? "1S%" : "1P%"}`)
        .lte("JOURDATE", toDate.toLocaleString("en-US"))
        .gte("JOURDATE", fromDate.toLocaleString("en-US"))
        .neq("CANCELED", "Y")
        .is("noteId", null)
        .order("accountId", { ascending: true })
        .order("JOURDATE", { ascending: true })
        .limit(parseInt(maxSearch));

      if (filterText !== "") {
        query = query.or(
          `ACCTNAME.ilike.%${filterText}%, ACCTNO.ilike.%${filterText}%`,
          {
            referencedTable: "accounts",
          }
        );
      }

      if (unpaidOnly) {
        query = query.neq("DUEAMT", 0);
      }

      if (!!currentAccountId) {
        query = query.eq("accountId", currentAccountId);
      }

      const { data, error } = await query;
      if (error) {
        console.log(error);
        return;
      }
      if (data !== null) {
        setBills(data);
      }
    }

    if (isOpen) getBillsSupabase();
  }, [
    isOpen,
    pathName,
    filterText,
    toDate,
    fromDate,
    maxSearch,
    unpaidOnly,
    currentAccountId,
  ]);

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger className="bg-gray-100 text-base p-2 rounded-md hover:bg-gray-200">
        ค้นหาบิล
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-[100%] overflow-auto flex">
        <section className="flex flex-col items-center gap-4 w-1/2">
          <div className="w-full flex gap-4 justify-center">
            <Input
              className={`rounded-md w-56`}
              type="text"
              placeholder="ชื่อลูกค้า..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            ></Input>

            <DateRange
              toDate={toDate}
              fromDate={fromDate}
              setToDate={setToDate}
              setFromDate={setFromDate}
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={unpaidOnly}
                onCheckedChange={setUnpaidOnly}
                id="unpaid-only"
              />
              <Label
                htmlFor="unpaid-only"
                className={`${unpaidOnly ? "" : "text-gray-400"}`}
              >
                เฉพาะค้างชำระ
              </Label>
            </div>
          </div>

          {!!bills && (
            <div className="h-[80vh] relative overflow-auto w-full">
              <NoteBillsTable
                bills={bills}
                currentBill={currentBill}
                handleClickBill={handleClickBill}
              />
            </div>
          )}

          <div className="flex gap-4 items-center">
            {/* <div className="flex gap-2 items-center">
              <span>เรียงลำดับตาม</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accountId">ชื่อลูกค้า</SelectItem>
                  <SelectItem value="JOURDATE">วันที่</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="flex gap-2 items-center">
              <Label htmlFor="result-limit">ค้นหาทั้งหมด</Label>
              <Select value={maxSearch} onValueChange={setMaxSearch}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        <section className="w-1/2">
          <div className="h-[15%] flex gap-4 items-center justify-center">
            {!!currentAccountName && (
              <div className="flex flex-col items-center">
                <span>กำลังสร้างใบวางบิลของ</span>
                <span className="font-semibold">{currentAccountName}</span>
              </div>
            )}

            {!!currentBill &&
              (selectedBills
                ?.map((bill) => bill.billId)
                .includes(currentBill.billId) ? (
                <Button
                  onClick={() => handleRemoveBill(currentBill)}
                  className="bg-secondary hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <RemoveSVG />
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddBill(currentBill)}
                  className="bg-secondary hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <span>เพิ่มบิลนี้</span>
                </Button>
              ))}
          </div>
          <div className="h-[85%]">
            <TransactionBillsItemList
              currentBillItems={billItems}
              currentBill={currentBill}
            />
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}

function RemoveSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentcolor"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}
