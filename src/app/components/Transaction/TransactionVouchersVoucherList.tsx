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
  handleClickColumn: (value: string) => void;
};

export default function TransactionVouchersVoucherList({
  accountVouchers,
  handleClickVoucher,
  currentVoucher,
  handleClickColumn,
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
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("VOUCDATE")}
            >
              วันที่
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("VOUCNO")}
            >
              เลขที่ใบสำคัญ
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
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("NETAMT")}
            >
              ยอดรวม
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("CASHAMT")}
            >
              เงินสด
            </TableHead>
            <TableHead
              className="hover:underline hover:cursor-pointer"
              onClick={() => handleClickColumn("CHKAMT")}
            >
              เช็ค
            </TableHead>
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
              <TableCell>
                {item.CASHAMT.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {item.CHKAMT.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {item.PAYAMT.toLocaleString("th-TH", {
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
