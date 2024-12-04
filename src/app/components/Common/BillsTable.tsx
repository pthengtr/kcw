import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { billType } from "../Transaction/TransactionProvider";

type BillsTableProps = {
  bills: billType[];
  currentBill: billType | undefined;
  handleClickBill?: (bill: billType) => void;
};
export default function BillsTable({
  bills,
  currentBill,
  handleClickBill,
}: BillsTableProps) {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-white">
        <TableRow>
          <TableHead>วันที่</TableHead>
          <TableHead>เวลา</TableHead>
          <TableHead>เลขที่บิล</TableHead>
          <TableHead>ชื่อลูกค้า</TableHead>
          <TableHead>ยอดรวม</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
