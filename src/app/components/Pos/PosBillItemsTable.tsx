import PosQtyPopover from "./PosQtyPopover";
import PosBillItemsUnitSelect from "./PosBillItemsUnitSelect";
import PosBillItemsPriceSelect from "./PosBillItemsPriceSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext } from "react";
import { PosContext, PosContextType, posItemsType } from "./PosProvider";
import { Checkbox } from "@/components/ui/checkbox";
import PosReturnQtySelect from "./PosReturnQtySelect";

export default function PosBillItemsTable() {
  const {
    posItems,
    getFullPrice,
    getAmount,
    handleCLickDeleteItem,
    returnMode,
    getReturnItemPrice,
    getReturnItemAmount,
    setPosItems,
  } = useContext(PosContext) as PosContextType;

  function handleItemCheckChange(item: posItemsType, checked: boolean) {
    const newPosItems = posItems?.map((posItem) => {
      if (item.BCODE === posItem.BCODE) posItem.isReturn = checked;
      return posItem;
    });

    setPosItems(newPosItems);
  }

  return (
    <div className="overflow-auto">
      <Table className="h-full relative">
        <TableHeader className="sticky top-0  bg-white">
          <TableRow>
            {returnMode && (
              <TableHead>{/*place holder for checkbox */}</TableHead>
            )}
            <TableHead>รหัสสินค้า</TableHead>
            <TableHead>ชื่อสินค้า</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>หน่วย</TableHead>
            <TableHead>{returnMode ? "ราคาขาย" : "ราคาเต็ม"}</TableHead>
            {!returnMode && <TableHead>ส่วนลด</TableHead>}
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>{/*place holder for delete button */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!posItems &&
            posItems.map((item) => (
              <TableRow key={item.BCODE}>
                {returnMode && (
                  <TableCell>
                    <Checkbox
                      id={item.BCODE}
                      onCheckedChange={(checked) =>
                        handleItemCheckChange(item, checked as boolean)
                      }
                      className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                      checked={item.isReturn}
                    />
                  </TableCell>
                )}
                <TableCell>{item.BCODE}</TableCell>
                <TableCell className="">
                  {item.ISVAT === "Y" && (
                    <span className="bg-secondary text-white px-1 rounded-sm text-xs">
                      VAT
                    </span>
                  )}{" "}
                  {item.DESCR}, {item.MODEL}
                </TableCell>

                <TableCell className="text-center">
                  {returnMode ? (
                    <PosReturnQtySelect item={item} />
                  ) : (
                    <PosQtyPopover item={item} />
                  )}
                </TableCell>
                <TableCell>
                  {returnMode ? (
                    item.returnUnit
                  ) : (
                    <PosBillItemsUnitSelect posItem={item} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {returnMode ? getReturnItemPrice(item) : getFullPrice(item)}
                </TableCell>
                {!returnMode && (
                  <TableCell className="text-right">
                    <PosBillItemsPriceSelect posItem={item} />
                  </TableCell>
                )}
                <TableCell className="text-right">
                  {returnMode ? getReturnItemAmount(item) : getAmount(item)}
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
