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
};

export default function TransactionNotesNoteList({
  accountNotes,
  handleClickNote,
  currentNote,
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
            <TableHead>วันที่</TableHead>
            <TableHead>เลขที่ใบวางบิล</TableHead>
            <TableHead>ชื่อ</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>ส่วนลด</TableHead>
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
              <TableCell>{item._accounts?.ACCTNAME}</TableCell>
              <TableCell>
                {parseFloat(item.BILLAMT ? item.BILLAMT : "0").toLocaleString()}
              </TableCell>
              <TableCell>
                {parseFloat(
                  item.DISCOUNT ? item.DISCOUNT : "0"
                ).toLocaleString()}
              </TableCell>
              <TableCell>
                {parseFloat(
                  item.NETAMT ? item.NETAMT : item.BILLAMT
                ).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
