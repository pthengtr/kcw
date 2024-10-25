import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useState } from "react";
import { PosContext, PosContextType, posItemsType } from "./PosProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PosQtyPopoverProps = {
  item: posItemsType;
};

export default function PosQtyPopover({ item }: PosQtyPopoverProps) {
  const { handleSetNewQty } = useContext(PosContext) as PosContextType;

  const [popOpen, setPopOpen] = useState(false);
  const [textInput, setTextInput] = useState(item.QTY.toString());

  function handleClickAdd(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const quantity = !!textInput ? parseInt(textInput) : item.QTY;

    setTextInput(
      Number.isNaN(quantity) ? item.QTY.toString() : (quantity + 1).toString()
    );
  }

  function handleClickRemove(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    const quantity = !!textInput ? parseInt(textInput) : item.QTY;

    setTextInput(
      Number.isNaN(quantity) ? item.QTY.toString() : (quantity - 1).toString()
    );
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      const qty = parseInt(textInput);
      handleSetNewQty(item.BCODE, Number.isNaN(qty) ? item.QTY : qty);
    }

    setPopOpen(isOpen);
  }

  function handleOnsubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const qty = parseInt(textInput);
    handleSetNewQty(item.BCODE, Number.isNaN(qty) ? item.QTY : qty);
    setPopOpen(false);
  }

  return (
    <Popover open={popOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger className="w-full h-full border rounded-md hover:bg-white focus:outline-none">
        {item.QTY}
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="flex gap-2 justify-evenly">
          <Button
            onClick={(e) => handleClickRemove(e)}
            className="bg-gray-200 text-gray-500 hover:bg-gray-100"
          >
            <RemoveIcon />
          </Button>
          <form onSubmit={(e) => handleOnsubmit(e)}>
            <Input
              id="qty-input"
              type="number"
              className="w-14 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </form>

          <Button
            onClick={(e) => handleClickAdd(e)}
            className="bg-gray-200 text-gray-500 hover:bg-gray-100"
          >
            <AddIcon />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentcolor"
    >
      <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentcolor"
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
}
