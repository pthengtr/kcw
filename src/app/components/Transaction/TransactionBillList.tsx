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
  } = useContext(TransactionContext) as TransactionContextType;

  return (
    <div className="overflow-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow className="w-full">
            <TableHead>วันที่</TableHead>
            <TableHead>เลขที่บิล</TableHead>
            <TableHead>ยอดรวม</TableHead>
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
            currentBills.map((item, index) => (
              <TableRow key={`${item.BILLNO}-${index}`}>
                <TableCell>
                  {new Date(item.JOURDATE).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger
                      className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                      onClick={() => handleClickBill(item.BILLNO)}
                    >
                      {item.BILLNO}
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
                  {item.AFTERTAX.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>

                <TableCell
                  onClick={
                    mode === "notes"
                      ? () => handleClickVoucher(item.voucherId)
                      : () => handleClickNote(item.noteId)
                  }
                  className={`${
                    mode === "notes"
                      ? item.notes &&
                        "hover:cursor-pointer hover:underline hover:italic"
                      : item.vouchers &&
                        "hover:cursor-pointer hover:underline hover:italic"
                  }`}
                >
                  {mode === "notes"
                    ? !!item.vouchers && (
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
                      )
                    : !!item.notes && (
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
                  {mode === "notes"
                    ? item.vouchers &&
                      new Date(item.vouchers?.VOUCDATE).toLocaleDateString()
                    : item.notes &&
                      new Date(item.notes?.NOTEDATE).toLocaleDateString(
                        "th-TH"
                      )}
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
    </div>
  );
}
