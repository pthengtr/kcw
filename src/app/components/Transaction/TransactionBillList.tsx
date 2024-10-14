import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  billsType,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import { useContext } from "react";

type TransactionBillListProps = {
  currentBills: billsType[] | undefined;
  mode: "notes" | "vouchers";
};

export default function TransactionBillList({
  currentBills,
  mode = "notes",
}: TransactionBillListProps) {
  const { handleClickNote, handleClickVoucher, handleClickBill } = useContext(
    TransactionContext
  ) as TransactionContextType;

  return (
    <div className="overflow-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead>วันที่</TableHead>
            <TableHead>เลขที่บิล</TableHead>
            <TableHead>ยอดรวม</TableHead>
            <TableHead>
              {mode === "notes" ? "เลขที่ใบสำคัญ" : "เลขที่ใบวางบิล"}
            </TableHead>
            <TableHead>
              {mode === "notes" ? "วันที่ใบสำคัญ" : "วันที่ใบวางบิล"}
            </TableHead>
            <TableHead>สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBills &&
            currentBills.map((item, index) => (
              <TableRow key={`${item.BILLNO}-${index}`}>
                <TableCell>
                  {new Date(item.JOURDATE).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell
                  onClick={() => handleClickBill(item.BILLNO)}
                  className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                >
                  {item.BILLNO}
                </TableCell>
                <TableCell>
                  {(
                    parseFloat(item.CASHAMT ? item.CASHAMT : "0") +
                    parseFloat(item.CHKAMT ? item.CHKAMT : "0") +
                    parseFloat(item.DUEAMT ? item.DUEAMT : "0")
                  ).toLocaleString()}
                </TableCell>

                <TableCell
                  onClick={
                    mode === "notes"
                      ? () => handleClickVoucher(item.voucherId)
                      : () => handleClickNote(item.noteId)
                  }
                  className={`${
                    mode === "notes"
                      ? item._notes &&
                        "hover:cursor-pointer hover:underline hover:italic"
                      : item._vouchers &&
                        "hover:cursor-pointer hover:underline hover:italic"
                  }`}
                >
                  {mode === "notes"
                    ? item._vouchers?.VOUCNO
                    : item._notes?.NOTENO}
                </TableCell>

                <TableCell>
                  {mode === "notes"
                    ? item._vouchers &&
                      new Date(item._vouchers?.VOUCDATE).toLocaleDateString()
                    : item._notes &&
                      new Date(item._notes?.NOTEDATE).toLocaleDateString(
                        "th-TH"
                      )}
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
