import NoteTable from "../Common/NoteTable";
import {
  noteType,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import { useContext, useEffect } from "react";

type TransactionNotesNoteListProps = {
  accountNotes: noteType[];
  currentNote: noteType | undefined;
  handleClickNote: (note: noteType) => void;
  handleClickColumn: (value: string) => void;
};

export default function TransactionNotesNoteList({
  accountNotes,
  handleClickNote,
  currentNote,
  handleClickColumn,
}: TransactionNotesNoteListProps) {
  const { scrollNote } = useContext(
    TransactionContext
  ) as TransactionContextType;

  useEffect(() => {
    if (!scrollNote) return;
    const element = document.getElementById(scrollNote.NOTENO);
    if (element !== null)
      element.scrollIntoView({
        block: "center",
        inline: "start",
      });
  }, [scrollNote]);

  return (
    <div className="overflow-auto w-full h-full">
      <NoteTable
        notes={accountNotes}
        currentNote={currentNote}
        handleClickNote={handleClickNote}
        handleClickColumn={handleClickColumn}
      />
    </div>
  );
}
