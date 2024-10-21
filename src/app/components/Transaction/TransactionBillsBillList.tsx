import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { billType } from "./TransactionProvider";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import { useContext, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionVouchersBillList from "./TransactionVouchersBillList";
import TransactionNotesBillList from "./TransactionNotesBillList";

type TransactionBillsBillListProps = {
  accountBills: billType[];
  currentBill: billType | undefined;
  handleClickBill: (bill: billType) => void;
  handleClickColumn: (value: string) => void;
};

export default function TransactionBillsBillList({
  accountBills,
  currentBill,
  handleClickBill,
  handleClickColumn,
}: TransactionBillsBillListProps) {
  const {
    handleClickNote,
    handleClickVoucher,
    scrollBill,
    currentVoucher,
    currentVoucherBills,
    currentNote,
    currentNoteBills,
  } = useContext(TransactionContext) as TransactionContextType;

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
      {accountBills.length > 0 && (
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
                {`เลขที่ใบสำคัญ${
                  accountBills[0]
                    ? accountBills[0].accounts.ACCTTYPE === "P"
                      ? "จ่าย"
                      : "รับ"
                    : ""
                }`}
              </TableHead>
              <TableHead
                className="hover:underline hover:cursor-pointer"
                onClick={() => handleClickColumn("_vouchers(VOUCDATE)")}
              >
                {`วันที่ใบสำคัญ${
                  accountBills
                    ? accountBills[0].accounts.ACCTTYPE === "P"
                      ? "จ่าย"
                      : "รับ"
                    : ""
                }`}
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
                  {item.AFTERTAX.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>

                <TableCell
                  className={`${
                    item.notes &&
                    "hover:cursor-pointer hover:underline hover:italic"
                  }`}
                  onClick={() => handleClickNote(item.noteId)}
                >
                  {!!item.notes && (
                    <Dialog>
                      <DialogTrigger
                        className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                        onClick={() => handleClickVoucher(item.voucherId)}
                      >
                        {item.notes?.NOTENO}
                      </DialogTrigger>
                      <DialogContent className="h-[80vh] sm:max-w-[1280px]">
                        {!!currentNote && (
                          <TransactionNotesBillList
                            currentNote={currentNote}
                            currentNoteBills={currentNoteBills}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>

                <TableCell>
                  {item.notes &&
                    new Date(item.notes?.NOTEDATE).toLocaleDateString("th-TH")}
                </TableCell>

                <TableCell>
                  {!!item.vouchers && (
                    <Dialog>
                      <DialogTrigger
                        className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                        onClick={() => handleClickVoucher(item.voucherId)}
                      >
                        {item.vouchers?.VOUCNO}
                      </DialogTrigger>
                      <DialogContent className="h-[80vh] sm:max-w-[1280px]">
                        {!!currentVoucher && (
                          <TransactionVouchersBillList
                            currentVoucher={currentVoucher}
                            currentVoucherBills={currentVoucherBills}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>

                <TableCell>
                  {item.vouchers &&
                    new Date(item.vouchers?.VOUCDATE).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {item.vouchers
                    ? "ชำระแล้ว"
                    : item.notes
                    ? "วางบิลแล้ว"
                    : "ยังไม่วางบิล"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
