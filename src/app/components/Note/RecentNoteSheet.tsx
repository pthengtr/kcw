"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { billType, noteType } from "../Transaction/TransactionProvider";
import { Input } from "@/components/ui/input";
import DateRange from "../Common/DateRange";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { createPreviousYearDate } from "../Transaction/TransactionProvider";
import NoteTable from "../Common/NoteTable";
import NoteBillsTable from "./NoteBillsTable";
import AccountHeader from "../Common/AccountHeader";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RecentNoteSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<noteType[]>();
  const [currentNote, setCurrentNote] = useState<noteType>();
  const [noteBills, setNoteBills] = useState<billType[]>();
  const [filterText, setFilterText] = useState("");
  const [toDate, setToDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(createPreviousYearDate(1));
  const [sortBy, setSortBy] = useState("NOTEDATE");
  const [maxSearch, setMaxSearch] = useState("50");

  const pathName = usePathname();

  async function getNoteBillsSupabase(noteId: string) {
    const { data, error } = await supabase
      .from("bills")
      .select(`*, vouchers(*), notes(*), accounts(*), bill_payment(*)`, {
        count: "exact",
      })
      .eq("noteId", noteId)
      .order("JOURDATE", { ascending: false })
      .limit(50);

    if (error) return;
    if (data !== null) setNoteBills(data);
  }

  function handleClickNote(note: noteType) {
    getNoteBillsSupabase(note.noteId.toString());
    setCurrentNote(note);
  }

  function handleSheetOpen(open: boolean) {
    setIsOpen(open);
    if (open) {
      setFilterText("");
      setToDate(new Date());
      setFromDate(createPreviousYearDate(1));
      setMaxSearch("50");
      setCurrentNote(undefined);
      setNoteBills(undefined);
      setSortBy("NOTEDATE");
    }
  }

  useEffect(() => {
    async function getBillsSupabase() {
      let query = supabase
        .from("notes")
        .select(`*, accounts!inner(*)`, {
          count: "exact",
        })
        .lte("NOTEDATE", toDate.toLocaleString("en-US"))
        .gte("NOTEDATE", fromDate.toLocaleString("en-US"))
        .eq("accounts.ACCTTYPE", pathName === "/sale-note" ? "S" : "P")
        .order(sortBy, { ascending: false })
        .limit(parseInt(maxSearch));

      if (filterText !== "") {
        query = query.or(
          `ACCTNAME.ilike.%${filterText}%, ACCTNO.ilike.%${filterText}%`,
          {
            referencedTable: "accounts",
          }
        );
      }

      const { data, error } = await query;
      if (error) {
        console.log(error);
        return;
      }
      if (data !== null) {
        setNotes(data);
      }
    }

    if (isOpen) getBillsSupabase();
  }, [
    isOpen,
    pathName,
    filterText,
    toDate,
    fromDate,
    sortBy,
    maxSearch,
    setNotes,
  ]);

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger className=" text-base p-2 ">ดูประวัติใบวางบิล</SheetTrigger>
      <SheetContent side="right" className="sm:max-w-[100%] overflow-auto flex">
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
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <span>เรียงลำดับตาม</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accountId">ชื่อลูกค้า</SelectItem>
                  <SelectItem value="NOTEDATE">วันที่</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-center">
              <span>ค้นหาทั้งหมด</span>
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
          {!!notes && (
            <div className="h-[70vh] relative overflow-auto w-full">
              <NoteTable
                showAccountName
                notes={notes}
                currentNote={currentNote}
                handleClickNote={handleClickNote}
                handleClickColumn={() => {}}
              />
            </div>
          )}
        </section>
        <section className="w-1/2 flex flex-col items-center gap-8">
          <div className="flex flex-col gap-4 items-center">
            {!!currentNote?.accounts && (
              <>
                <AccountHeader currentAccount={currentNote?.accounts} />
                <div className="flex gap-4 justify-center items-center">
                  <Label>วันที่วางบิล</Label>
                  <span className="p-1 bg-gray-100 rounded-md">
                    {new Date(currentNote?.NOTEDATE).toLocaleDateString(
                      "th-TH"
                    )}
                  </span>
                  <Label>เลขที่ใบวางบิล</Label>
                  <span className="p-1 bg-gray-100 rounded-md">
                    {currentNote.NOTENO}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="h-[60%] w-full relative overflow-auto">
            {!!noteBills && (
              <NoteBillsTable
                bills={noteBills}
                currentBill={undefined}
                handleClickBill={undefined}
              />
            )}
          </div>
          {!!noteBills && (
            <>
              <Card className="p-2 self-end mx-16">
                <CardContent className="p-2 grid grid-cols-2 gap-y-2 gap-x-6 items-center justify-items-end">
                  <Label>จำนวนบิล</Label>
                  <span className="font-semibold">{noteBills?.length}</span>
                  <Label>ราคาเต็มรวม</Label>
                  <span className="font-semibold">
                    {currentNote?.BILLAMT.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <Label>ส่วนลด</Label>
                  <span className="font-semibold">
                    {currentNote?.DISCOUNT.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <Label>ยอดรวม</Label>
                  <span className="font-semibold">
                    {currentNote?.NETAMT.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </CardContent>
              </Card>
            </>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
}
