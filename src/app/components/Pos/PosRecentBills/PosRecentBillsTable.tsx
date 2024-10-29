import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { billType } from "../../Transaction/TransactionProvider";

type PosRecentBillsTableProps = {
  posFilterRecentBills: billType[];
  posCurrentRecentBill: billType | undefined;
  handleClickRecentBill: (bill: billType) => void;
};

export default function PosRecentBillsTable({
  posFilterRecentBills,
  posCurrentRecentBill,
  handleClickRecentBill,
}: PosRecentBillsTableProps) {
  return (
    <div className="h-[70vh] relative overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>วันที่</TableHead>
            <TableHead>เวลา</TableHead>
            <TableHead>เลขที่บิล</TableHead>
            <TableHead>เลขที่ใบสำคัญ</TableHead>
            <TableHead>ชื่อลูกค้า</TableHead>
            <TableHead>ยอดรวม</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posFilterRecentBills.map((bill) => (
            <TableRow
              key={bill.billId}
              className={`${
                posCurrentRecentBill?.billId === bill.billId
                  ? "bg-primary text-white hover:bg-primary"
                  : ""
              }`}
              onClick={() => handleClickRecentBill(bill)}
            >
              <TableCell>
                {new Date(bill.JOURDATE).toLocaleDateString("th-TH")}
              </TableCell>
              <TableCell>
                {new Date(bill.JOURDATE).toLocaleTimeString("th-TH")}
              </TableCell>
              <TableCell>{bill.BILLNO}</TableCell>
              <TableCell>{bill.vouchers?.VOUCNO}</TableCell>
              <TableCell className="w-48">{bill.accounts?.ACCTNAME}</TableCell>
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
    </div>
  );
}
