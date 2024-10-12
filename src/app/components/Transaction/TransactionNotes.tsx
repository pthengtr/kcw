import { useEffect, useState, useContext } from "react";
import { supabase } from "@/app/lib/supabase";
import { billsType, noteType } from "./TransactionProvider";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import TransactionNotesNoteList from "./TransactionNotesNoteList";
import TransactionBillList from "./TransactionBillList";

type TransactionNotesProps = {
  accountId: string;
};

export default function TransactionNotes({ accountId }: TransactionNotesProps) {
  const [accountNotes, setAccountNotes] = useState<noteType[]>();
  const [currentNote, setCurrentNote] = useState<noteType>();
  const [currentNoteBills, setCurrentNoteBills] = useState<billsType[]>();
  const { toDate, fromDate } = useContext(
    TransactionContext
  ) as TransactionContextType;

  function handleClickNote(note: noteType) {
    async function getCurrentNoteBillsSupabase() {
      const { data, error } = await supabase
        .from("_bills")
        .select(`*, _vouchers(*), _notes(*)`)
        .eq("noteId", note.noteId)
        .order("JOURDATE", { ascending: false })
        .limit(100);

      console.log(data);

      if (error) return;
      if (data !== null) setCurrentNoteBills(data);
    }

    setCurrentNote(note);
    getCurrentNoteBillsSupabase();
  }

  useEffect(() => {
    async function getBillsSupabase() {
      const { data, error } = await supabase
        .from("_notes")
        .select(`*, _accounts(*)`)
        .eq("accountId", accountId)
        .order("NOTEDATE", { ascending: false })
        .lte("NOTEDATE", toDate.toLocaleString())
        .gte("NOTEDATE", fromDate.toLocaleString())
        .limit(100);

      if (error) return;
      if (data !== null) setAccountNotes(data);
    }

    getBillsSupabase();
  }, [accountId, setAccountNotes, fromDate, toDate]);

  return (
    <>
      {accountNotes && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[70vh]">
            <TransactionNotesNoteList
              accountNotes={accountNotes}
              handleClickNote={handleClickNote}
              currentNote={currentNote}
            />
          </ResizablePanel>
          <ResizableHandle className="p-0.5 m-1 bg-slate-100" />
          <ResizablePanel className="h-[70vh]">
            <TransactionBillList currentBills={currentNoteBills} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
