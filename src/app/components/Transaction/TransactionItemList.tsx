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
                {item.productInfo
                  ? `${item.productInfo.DESCR}, ${item.productInfo.MODEL}`
                  : ""}
              </TableCell>
              <TableCell>{parseInt(item.QTY ? item.QTY : "0")}</TableCell>
              <TableCell>{item.UI}</TableCell>
              <TableCell>
                {parseFloat(item.PRICE ? item.PRICE : "0").toLocaleString()}
              </TableCell>
              <TableCell>
                {parseFloat(item.DISCNT1 ? item.DISCNT1 : "0").toLocaleString()}
              </TableCell>
              <TableCell>
                {parseFloat(item.AMOUNT ? item.AMOUNT : "0").toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
