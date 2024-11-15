import PosQtyPopover from "../Pos/PosQtyPopover";
import PosBillItemsUnitSelect from "../Pos/PosBillItemsUnitSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext } from "react";
import { PosContext, PosContextType, posItemsType } from "../Pos/PosProvider";
import PurchaseCostPopover from "./PurchaseCostPopover";
import PurchaseDiscountPopover from "./PurchaseDiscountPopover";

export default function PosBillItemsTable() {
  const { posItems, handleCLickDeleteItem, vat } = useContext(
    PosContext
  ) as PosContextType;

  function getItemAmount(item: posItemsType) {
    return (
      item.cost *
      item.QTY *
      (1 - item.DISCNT1 / 100) *
      (1 - item.DISCNT2 / 100) *
      (1 - item.DISCNT3 / 100) *
      (1 - item.DISCNT4 / 100)
    ).toLocaleString("th-TH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  return (
    <div className="overflow-auto">
      <Table className="h-full relative">
        <TableHeader className="sticky top-0  bg-white">
          <TableRow>
            <TableHead>รหัสสินค้า</TableHead>
            <TableHead>ชื่อสินค้า</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>หน่วย</TableHead>
            <TableHead>{`ราคา${vat === "vat" ? "รวมภาษี" : ""}`}</TableHead>
            <TableHead>ส่วนลด</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>{/*place holder for delete button */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!posItems &&
            posItems.map((item) => (
              <TableRow
                className={`${item.returnQty <= 0 ? "text-gray-400" : ""} `}
                key={item.BCODE}
              >
                <TableCell>{item.BCODE}</TableCell>
                <TableCell className="">
                  {item.ISVAT === "Y" && (
                    <span className="bg-secondary text-white px-1 rounded-sm text-xs">
                      VAT
                    </span>
                  )}
                  {item.DESCR}, {item.MODEL}
                </TableCell>

                <TableCell className="text-center">
                  <PosQtyPopover item={item} />
                </TableCell>
                <TableCell>
                  <PosBillItemsUnitSelect posItem={item} />
                </TableCell>
                <TableCell className="text-right">
                  <PurchaseCostPopover item={item} />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-1 items-center">
                    <PurchaseDiscountPopover item={item} mode="item" />
                    <span>%</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {getItemAmount(item)}
                </TableCell>

                <TableCell
                  onClick={() => handleCLickDeleteItem(item.BCODE)}
                  className="text-gray-300 hover:cursor-pointer hover:text-gray-500"
                >
                  <TrashIcon />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentcolor"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}
