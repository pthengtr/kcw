import { Dialog, DialogContent } from "@/components/ui/dialog";
import TransactionBillsItemList from "../Transaction/TransactionBillsItemList";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { NoteContext, NoteContextType } from "./NoteProvider";

export default function NoteDetailDialog() {
  const {
    noteDetailOpen,
    setNoteDetailOpen,
    currentBill,
    currentBillItems,
    handleRemoveBill,
  } = useContext(NoteContext) as NoteContextType;

  return (
    <Dialog open={noteDetailOpen} onOpenChange={setNoteDetailOpen}>
      <DialogContent className="sm:max-w-[1280px] h-[90%]">
        <Button
          onClick={() => !!currentBill && handleRemoveBill(currentBill)}
          className="bg-secondary text-gray-200 hover:bg-red-700 mx-8"
        >
          <DeleteSVG />
        </Button>
        <TransactionBillsItemList
          currentBill={currentBill}
          currentBillItems={currentBillItems}
        />
      </DialogContent>
    </Dialog>
  );
}

function DeleteSVG() {
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
