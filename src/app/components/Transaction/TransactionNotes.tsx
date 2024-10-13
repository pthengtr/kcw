import { useEffect, useContext } from "react";
import { supabase } from "@/app/lib/supabase";
import { noteType } from "./TransactionProvider";
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
  const {
    accountNotes,
    setAccountNotes,
    currentNote,
    setCurrentNote,
    currentNoteBills,
    getCurrentNoteBillsSupabase,
    toDate,
    fromDate,
    filterText,
  } = useContext(TransactionContext) as TransactionContextType;

  function handleClickNote(note: noteType) {
    setCurrentNote(note);
    getCurrentNoteBillsSupabase(note.noteId);
  }

  useEffect(() => {
    setCurrentNote(undefined);
  }, [accountId, setCurrentNote]);

  useEffect(() => {
    async function getNotesSupabase() {
      const { data, error } = await supabase
        .from("_notes")
        .select(`*, _accounts(*)`)
        .ilike("NOTENO", `%${filterText}%`)
        .eq("accountId", accountId)
        .order("NOTEDATE", { ascending: false })
        .lte("NOTEDATE", toDate.toLocaleString())
        .gte("NOTEDATE", fromDate.toLocaleString())
        .limit(100);

      if (error) return;
      if (data !== null) setAccountNotes(data);
    }

    getNotesSupabase();
  }, [accountId, setAccountNotes, fromDate, toDate, filterText]);

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
          <ResizablePanel className="h-[70vh] flex flex-col gap-6">
            {currentNote && (
              <>
                <div className="flex gap-4 justify-center mt-6 text-lg">
                  <span>ใบวางบิลเลขที่</span>
                  <span className="font-semibold">{currentNote.NOTENO}</span>
                  <span>วันที่</span>
                  <span className="font-semibold">
                    {new Date(currentNote.NOTEDATE).toLocaleDateString("th-TH")}
                  </span>
                </div>
                <TransactionBillList
                  currentBills={currentNoteBills}
                  mode="notes"
                />
              </>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
