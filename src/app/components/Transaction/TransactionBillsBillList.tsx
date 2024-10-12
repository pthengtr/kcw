import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { billsType } from "./TransactionProvider";

type TransactionBillsBillListProps = {
  accountBills: billsType[];
  currentBill: billsType | undefined;
  handleClickBill: (bill: billsType) => void;
};

export default function TransactionBillsBillList({
  accountBills,
  currentBill,
  handleClickBill,
}: TransactionBillsBillListProps) {
  return (
    <div className="overflow-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead>วันที่</TableHead>
            <TableHead>เลขที่บิล</TableHead>
            <TableHead>ยอดรวม</TableHead>
            <TableHead>วันที่ใบวางบิล</TableHead>
            <TableHead>เลขที่ใบวางบิล</TableHead>
            <TableHead>วันที่ใบสำคัญ</TableHead>
            <TableHead>เลขที่ใบสำคัญ</TableHead>
            <TableHead>สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountBills.map((item, index) => (
            <TableRow
              onClick={() => handleClickBill(item)}
              className={`${
                currentBill?.BILLNO === item.BILLNO
                  ? "bg-primary text-white hover:bg-primary"
                  : ""
              }`}
              key={`${item.BILLNO}-${index}`}
            >
              <TableCell>
                {new Date(item.JOURDATE).toLocaleDateString("th-TH")}
              </TableCell>
              <TableCell>{item.BILLNO}</TableCell>
              <TableCell>
                {(
                  parseFloat(item.CASHAMT ? item.CASHAMT : "0") +
                  parseFloat(item.CHKAMT ? item.CHKAMT : "0") +
                  parseFloat(item.DUEAMT ? item.DUEAMT : "0")
                ).toLocaleString()}
              </TableCell>

              <TableCell>{item._notes?.NOTENO}</TableCell>
              <TableCell>
                {item._notes &&
                  new Date(item._notes?.NOTEDATE).toLocaleDateString("th-TH")}
              </TableCell>
              <TableCell>{item._vouchers?.VOUCNO}</TableCell>
              <TableCell>
                {item._vouchers &&
                  new Date(item._vouchers?.VOUCDATE).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {item._vouchers
                  ? "ชำระแล้ว"
                  : item._notes
                  ? "วางบิลแล้ว"
                  : "ยังไม่วางบิล"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
