import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { billType } from "../Transaction/TransactionProvider";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { NoteContext, NoteContextType } from "./NoteProvider";

type NoteBillsTableProps = {
  bills: billType[];
  currentBill: billType | undefined;
  handleClickBill?: (bill: billType) => void;
};
export default function NoteBillsTable({
  bills,
  currentBill,
  handleClickBill,
}: NoteBillsTableProps) {
  const {
    handleAddBill,
    handleRemoveBill,
    noteBills: selectedBills,
  } = useContext(NoteContext) as NoteContextType;

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-white">
        <TableRow>
          <TableHead>วันที่</TableHead>
          <TableHead>เวลา</TableHead>
          <TableHead>เลขที่บิล</TableHead>
          <TableHead>ชื่อลูกค้า</TableHead>
          <TableHead>ยอดรวม</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow
            key={bill.billId}
            className={`${
              currentBill?.billId === bill.billId
                ? "bg-primary text-white hover:bg-primary"
                : ""
            }`}
            onClick={() => !!handleClickBill && handleClickBill(bill)}
          >
            <TableCell>
              {new Date(bill.JOURDATE).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </TableCell>
            <TableCell>
              {new Date(bill.JOURDATE).toLocaleTimeString("th-TH")}
            </TableCell>
            <TableCell className="w-36">{bill.BILLNO}</TableCell>
            <TableCell className="min-w-48">
              {bill.accounts?.ACCTNAME}
            </TableCell>
            <TableCell className="text-right">
              {bill.AFTERTAX.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell className="flex justify-center w-20">
              {selectedBills
                ?.map((selectedBill) => selectedBill.billId)
                .includes(bill.billId) ? (
                <Button
                  onClick={() => handleRemoveBill(bill)}
                  className="bg-transparent text-inherit hover:border p-2"
                >
                  <CheckSVG />
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddBill(bill)}
                  className="bg-transparent text-inherit hover:border p-2"
                >
                  <AddSVG />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AddSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentcolor"
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
}

function CheckSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentcolor"
    >
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
    </svg>
  );
}
