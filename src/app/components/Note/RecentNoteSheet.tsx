"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { billType, noteType } from "../Transaction/TransactionProvider";
import BillsTable from "../Common/BillsTable";
import { Input } from "@/components/ui/input";
import DateRange from "../Common/DateRange";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { createLastYearDate } from "../Transaction/TransactionProvider";
import NoteTable from "../Common/NoteTable";

export default function RecentNoteSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<noteType[]>();
  const [currentNote, setCurrentNote] = useState<noteType>();
  const [noteBills, setNoteBills] = useState<billType[]>();
  const [filterText, setFilterText] = useState("");
  const [toDate, setToDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(createLastYearDate());
  const [sortBy, setSortBy] = useState("accountId");
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
      setFromDate(createLastYearDate());
      setMaxSearch("50");
      setCurrentNote(undefined);
      setNoteBills(undefined);
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
        <section className="w-1/2">
          <div className="h-[85%]">
            {!!noteBills && (
              <BillsTable
                bills={noteBills}
                currentBill={undefined}
                handleClickBill={undefined}
              />
            )}
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
