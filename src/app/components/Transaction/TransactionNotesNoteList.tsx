import {
  noteType,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import { useContext, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("NOTEDATE")}
            >
              วันที่
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("NOTENO")}
            >
              เลขที่ใบวางบิล
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("BILLAMT")}
            >
              จำนวนเงิน
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("DISCOUNT")}
            >
              ส่วนลด
            </TableHead>
            <TableHead>ยอดรวม</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountNotes.map((item, index) => (
            <TableRow
              id={item.NOTENO}
              key={`${item.NOTENO}-${index}`}
              onClick={() => handleClickNote(item)}
              className={`${
                currentNote?.NOTENO === item.NOTENO
                  ? "bg-primary text-white hover:bg-primary"
                  : ""
              }`}
            >
              <TableCell>
                {new Date(item.NOTEDATE).toLocaleDateString("th-TH")}
              </TableCell>
              <TableCell>{item.NOTENO}</TableCell>
              <TableCell>
                {item.BILLAMT.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {item.DISCOUNT.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {item.NETAMT.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
