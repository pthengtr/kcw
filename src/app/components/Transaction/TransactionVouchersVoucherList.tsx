import {
  TransactionContext,
  TransactionContextType,
  voucherType,
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

type TransactionVouchersVoucherListProps = {
  accountVouchers: voucherType[];
  handleClickVoucher: (voucher: voucherType) => void;
  currentVoucher: voucherType | undefined;
};

export default function TransactionVouchersVoucherList({
  accountVouchers,
  handleClickVoucher,
  currentVoucher,
}: TransactionVouchersVoucherListProps) {
  const { scrollVoucher } = useContext(
    TransactionContext
  ) as TransactionContextType;

  useEffect(() => {
    if (!scrollVoucher) return;
    const element = document.getElementById(scrollVoucher.VOUCNO);
    if (element !== null) {
      element.scrollIntoView({
        block: "center",
        inline: "start",
      });
    }
  }, [scrollVoucher]);
  return (
    <div className="overflow-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead>วันที่</TableHead>
            <TableHead>เลขที่ใบสำคัญ</TableHead>
            <TableHead>ชื่อ</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>ส่วนลด</TableHead>
            <TableHead>ยอดรวม</TableHead>
            <TableHead>เงินสด</TableHead>
            <TableHead>เช็ค</TableHead>
            <TableHead>ชำระแล้ว</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountVouchers.map((item, index) => (
            <TableRow
              id={item.VOUCNO}
              key={`${item.VOUCNO}-${index}`}
              onClick={() => handleClickVoucher(item)}
              className={`${
                currentVoucher?.VOUCNO === item.VOUCNO
                  ? "bg-primary text-white hover:bg-primary"
                  : ""
              }`}
            >
              <TableCell>
                {new Date(item.VOUCDATE).toLocaleDateString("th-TH")}
              </TableCell>
              <TableCell>{item.VOUCNO}</TableCell>
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
              <TableCell>
                {parseFloat(item.CASHAMT ? item.CASHAMT : "0").toLocaleString()}
              </TableCell>
              <TableCell>
                {parseFloat(item.CHKAMT ? item.CHKAMT : "0").toLocaleString()}
              </TableCell>
              <TableCell>
                {parseFloat(item.PAYAMT ? item.PAYAMT : "0").toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
