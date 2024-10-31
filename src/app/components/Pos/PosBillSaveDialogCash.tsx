import { PosContext, PosContextType } from "./PosProvider";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const notes = [1000, 500, 100, 50, 20, 10, 5, 1];

export default function PosBillSaveDialogCash() {
  const [receive, setReceive] = useState("");
  const { getSumAmount, posItems } = useContext(PosContext) as PosContextType;

  const sumAmount = getSumAmount();
  return (
    <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-xl items-baseline text-right p-6 border rounded-lg">
      <span>จำนวนรายการ</span>
      <span className="text-right">{!!posItems ? posItems.length : 0}</span>

      <span className="text-right">ยอดรวม</span>
      <span className="font-semibold text-2xl bg-primary text-white rounded.md px-1 justify-self-end rounded-sm">
        {sumAmount}
      </span>

      <span className="text-right">รับเงิน</span>
      <span className="flex justify-end">
        <Input
          value={receive}
          type="number"
          onChange={(e) => setReceive(e.target.value)}
          className="w-48 text-right text-2xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </span>

      <div className="col-span-2 flex gap-2 justify-evenly items-center">
        <AddSVG />
        {notes.map((note, index) => (
          <Button
            key={`${note}-${index}+`}
            onClick={() =>
              setReceive((cur) =>
                (parseInt(cur === "" ? "0" : cur) + note).toString()
              )
            }
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            {note}
          </Button>
        ))}
      </div>

      <div className="col-span-2 flex gap-2 justify-evenly items-center">
        <RemoveSVG />
        {notes.map((note, index) => (
          <Button
            key={`${note}-${index}-`}
            onClick={() =>
              setReceive((cur) =>
                (parseInt(cur === "" ? "0" : cur) - note).toString()
              )
            }
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            {note}
          </Button>
        ))}
      </div>

      <span className="text-right">เงินทอน</span>
      <span className="font-semibold text-4xl">
        {(
          parseFloat(receive === "" ? "0" : receive) -
          parseFloat(sumAmount.replaceAll(",", ""))
        ).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

function AddSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
}

function RemoveSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
}
