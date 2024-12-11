import { useEffect, useContext, useState } from "react";
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
import TransactionTotalCount from "../TotalCount";
import TransactionNoteBillList from "./TransactionNotesBillList";

export default function TransactionNotes() {
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
    currentAccount,
  } = useContext(TransactionContext) as TransactionContextType;
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState("50");

  const [sortBy, setSortBy] = useState("NOTEDATE");
  const [sortAsc, setSortAsc] = useState(false);

  function handleClickColumn(column: string) {
    if (sortBy === column) {
      setSortAsc((cur) => !cur);
      return;
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  }

  function handleClickNote(note: noteType) {
    setCurrentNote(note);
    getCurrentNoteBillsSupabase(note.noteId);
  }

  useEffect(() => {
    async function getNotesSupabase() {
      const { data, error, count } = await supabase
        .from("notes")
        .select(`*, accounts(*)`, { count: "exact" })
        .ilike("NOTENO", `%${filterText}%`)
        .eq("accountId", currentAccount?.accountId)
        .order(sortBy, { ascending: sortAsc })
        .lte("NOTEDATE", toDate.toLocaleString("en-US"))
        .gte("NOTEDATE", fromDate.toLocaleString("en-US"))
        .limit(parseInt(limit));

      if (error) return;
      if (data !== null) setAccountNotes(data);
      if (count !== null) setTotalCount(count);
    }

    getNotesSupabase();
  }, [
    currentAccount,
    setAccountNotes,
    fromDate,
    toDate,
    filterText,
    limit,
    sortBy,
    sortAsc,
  ]);

  return (
    <>
      {accountNotes && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-[80vh] flex flex-col gap-4">
            <TransactionNotesNoteList
              accountNotes={accountNotes}
              handleClickNote={handleClickNote}
              currentNote={currentNote}
              handleClickColumn={handleClickColumn}
            />
            <TransactionTotalCount
              totalCount={totalCount}
              limit={limit}
              setLimit={setLimit}
            />
          </ResizablePanel>
          <ResizableHandle className="p-0.5 m-1 bg-slate-100" />
          <ResizablePanel className="h-[80vh]">
            {currentNote && (
              <TransactionNoteBillList
                currentNote={currentNote}
                currentNoteBills={currentNoteBills}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
