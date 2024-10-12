import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { itemsType, billsType } from "./TransactionProvider";

type TransactionBillsItemListProps = {
  currentBillItems: itemsType[] | undefined;
  currentBill: billsType | undefined;
};

export default function TransactionBillsItemList({
  currentBillItems,
  currentBill,
}: TransactionBillsItemListProps) {
  return (
    <>
      {currentBillItems && (
        <div className="w-full h-[75vh] overflow-auto text-lg p-4 flex flex-col gap-4">
          {currentBill && (
            <div className="flex gap-4 justify-center">
              <span>บิลเลขที่</span>
              <span className="font-semibold">{currentBill.BILLNO}</span>
              <span>วันที่</span>
              <span className="font-semibold">
                {new Date(currentBill.JOURDATE).toLocaleDateString("th-TH")}
              </span>
            </div>
          )}
          <div className="relative overflow-auto h-[45vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>หน่วย</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>ส่วนลด</TableHead>
                  <TableHead>จำนวนเงิน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBillItems.map((item, index) => (
                  <TableRow key={`${item.BILLNO}-${index}`}>
                    <TableCell>{item.BCODE}</TableCell>
                    <TableCell>
                      {item.productInfo
                        ? `${item.productInfo.DESCR}, ${item.productInfo.MODEL}`
                        : ""}
                    </TableCell>
                    <TableCell>{parseInt(item.QTY ? item.QTY : "0")}</TableCell>
                    <TableCell>{item.UI}</TableCell>
                    <TableCell>
                      {parseFloat(
                        item.PRICE ? item.PRICE : "0"
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {parseFloat(
                        item.DISCNT1 ? item.DISCNT1 : "0"
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {parseFloat(
                        item.AMOUNT ? item.AMOUNT : "0"
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {currentBill && (
            <div className="flex justify-end mr-8 text-base mt-auto h-fit">
              <div className="grid grid-cols-2 w-fit justify-end gap-4 border p-4 rounded-lg">
                <span>จำนวนเงิน</span>
                <span className="font-semibold">
                  {parseFloat(
                    currentBill.BEFORETAX ? currentBill.BEFORETAX : "0"
                  ).toLocaleString()}
                </span>
                <span>ภาษี</span>
                <span className="font-semibold">{currentBill.VAT}%</span>
                <span>ยอดรวม</span>
                <span className="font-semibold">
                  {parseFloat(
                    currentBill.AFTERTAX ? currentBill.AFTERTAX : "0"
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
