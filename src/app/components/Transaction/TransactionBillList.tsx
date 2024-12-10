import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  billType,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionBillsItemList from "./TransactionBillsItemList";
import TransactionVouchersBillList from "./TransactionVouchersBillList";
import TransactionNotesBillList from "./TransactionNotesBillList";

type TransactionBillListProps = {
  currentBills: billType[] | undefined;
  mode: "notes" | "vouchers";
  acctType: "P" | "S";
};

const accountType = {
  P: "จ่าย",
  S: "รับ",
};

export default function TransactionBillList({
  currentBills,
  mode = "notes",
  acctType,
}: TransactionBillListProps) {
  const {
    handleClickNote,
    handleClickVoucher,
    handleClickBill,
    currentBill,
    currentBillItems,
    currentVoucher,
    currentVoucherBills,
    currentNote,
    currentNoteBills,
    getBillStatus,
  } = useContext(TransactionContext) as TransactionContextType;

  return (
    <div className="overflow-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead>วันที่</TableHead>
            <TableHead>เลขที่บิล</TableHead>
            <TableHead>ยอดค้างชำระ</TableHead>
            <TableHead>
              {mode === "notes"
                ? `เลขที่ใบสำคัญ${accountType[acctType]}`
                : "เลขที่ใบวางบิล"}
            </TableHead>
            <TableHead>
              {mode === "notes"
                ? `วันที่ใบสำคัญ${accountType[acctType]}`
                : "วันที่ใบวางบิล"}
            </TableHead>
            <TableHead>สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBills &&
            currentBills.map((bill, index) => (
              <TableRow key={`${bill.BILLNO}-${index}`}>
                <TableCell>
                  {new Date(bill.JOURDATE).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger
                      className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                      onClick={() => handleClickBill(bill.BILLNO)}
                    >
                      {bill.BILLNO}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1280px]">
                      <DialogHeader>
                        <TransactionBillsItemList
                          currentBill={currentBill}
                          currentBillItems={currentBillItems}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  {!!bill.bill_payment
                    ? bill.bill_payment
                        .reduce(
                          (acc, payment) =>
                            payment.PAYTYPE !== "VOUCHER"
                              ? acc - payment.AMOUNT
                              : acc,
                          bill.AFTERTAX
                        )
                        .toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                    : ""}
                </TableCell>

                <TableCell
                  onClick={
                    mode === "notes"
                      ? () => {
                          if (!!bill.voucherId)
                            handleClickVoucher(bill.voucherId);
                        }
                      : () => {
                          if (!!bill.noteId) handleClickNote(bill.noteId);
                        }
                  }
                  className={`${
                    mode === "notes"
                      ? bill.notes &&
                        "hover:cursor-pointer hover:underline hover:italic"
                      : bill.vouchers &&
                        "hover:cursor-pointer hover:underline hover:italic"
                  }`}
                >
                  {mode === "notes"
                    ? !!bill.vouchers && (
                        <Dialog>
                          <DialogTrigger
                            className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                            onClick={() => {
                              if (!!bill.voucherId)
                                handleClickVoucher(bill.voucherId);
                            }}
                          >
                            {bill.vouchers?.VOUCNO}
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
                      )
                    : !!bill.notes && (
                        <Dialog>
                          <DialogTrigger
                            className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                            onClick={() => {
                              if (!!bill.voucherId)
                                handleClickVoucher(bill.voucherId);
                            }}
                          >
                            {bill.notes?.NOTENO}
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
                  {mode === "notes"
                    ? bill.vouchers &&
                      new Date(bill.vouchers?.VOUCDATE).toLocaleDateString()
                    : bill.notes &&
                      new Date(bill.notes?.NOTEDATE).toLocaleDateString(
                        "th-TH"
                      )}
                </TableCell>

                <TableCell>{getBillStatus(bill)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
