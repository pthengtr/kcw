import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { itemsType } from "./TransactionProvider";

type TransactionItemListProps = {
  currentItems: itemsType[];
};

export default function TransactionItemList({
  currentItems,
}: TransactionItemListProps) {
  return (
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
          {currentItems.map((item, index) => (
            <TableRow key={`${item.BILLNO}-${index}`}>
              <TableCell>{item.BCODE}</TableCell>
              <TableCell>
                {item.products
                  ? `${item.products.DESCR}, ${item.products.MODEL}`
                  : ""}
              </TableCell>
              <TableCell>{item.QTY}</TableCell>
              <TableCell>{item.UI}</TableCell>
              <TableCell>
                {item.PRICE.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {item.DISCNT1.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {item.AMOUNT.toLocaleString("th-TH", {
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
