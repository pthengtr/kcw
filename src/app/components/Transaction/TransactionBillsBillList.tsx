import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { billsType } from "./TransactionProvider";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import { useContext, useEffect } from "react";

type TransactionBillsBillListProps = {
  accountBills: billsType[];
  currentBill: billsType | undefined;
  handleClickBill: (bill: billsType) => void;
  handleClickColumn: (value: string) => void;
};

export default function TransactionBillsBillList({
  accountBills,
  currentBill,
  handleClickBill,
  handleClickColumn,
}: TransactionBillsBillListProps) {
  const { handleClickNote, handleClickVoucher, scrollBill } = useContext(
    TransactionContext
  ) as TransactionContextType;

  useEffect(() => {
    if (!scrollBill) return;
    const element = document.getElementById(scrollBill.BILLNO);
    if (element !== null)
      element.scrollIntoView({
        block: "center",
        inline: "start",
      });
  }, [scrollBill]);

  return (
    <div className="overflow-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("JOURDATE")}
            >
              วันที่
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("BILLNO")}
            >
              เลขที่บิล
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("DUEAMT")}
            >
              ยอดรวม
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("_notes(NOTENO)")}
            >
              เลขที่ใบวางบิล
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("_notes(NOTEDATE)")}
            >
              วันที่ใบวางบิล
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("_vouchers(VOUCNO)")}
            >
              เลขที่ใบสำคัญ
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("_vouchers(VOUCDATE)")}
            >
              วันที่ใบสำคัญ
            </TableHead>
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
              id={item.BILLNO}
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

              <TableCell
                className={`${
                  item._notes &&
                  "hover:cursor-pointer hover:underline hover:italic"
                }`}
                onClick={() => handleClickNote(item.noteId)}
              >
                {item._notes?.NOTENO}
              </TableCell>

              <TableCell>
                {item._notes &&
                  new Date(item._notes?.NOTEDATE).toLocaleDateString("th-TH")}
              </TableCell>

              <TableCell
                onClick={() => handleClickVoucher(item.voucherId)}
                className={`${
                  item._vouchers &&
                  "hover:cursor-pointer hover:underline hover:italic"
                }`}
              >
                {item._vouchers?.VOUCNO}
              </TableCell>

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
