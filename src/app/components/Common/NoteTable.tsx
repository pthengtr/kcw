import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { noteType } from "../Transaction/TransactionProvider";

type NoteTableProps = {
  showAccountName?: boolean;
  notes: noteType[];
  currentNote: noteType | undefined;
  handleClickNote: (note: noteType) => void;
  handleClickColumn: (column: string) => void;
};

export default function NoteTable({
  notes,
  currentNote,
  handleClickNote,
  handleClickColumn,
  showAccountName = false,
}: NoteTableProps) {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-white">
        <TableRow className="w-full">
          <TableHead
            className="hover:underline hover:cursor-pointer"
            onClick={() => handleClickColumn("NOTEDATE")}
          >
            วันที่
          </TableHead>
          {showAccountName && <TableHead>ชื่อลูกค้า</TableHead>}
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
        {notes.map((item, index) => (
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
            {showAccountName && (
              <TableCell>{item.accounts?.ACCTNAME}</TableCell>
            )}
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
  );
}
