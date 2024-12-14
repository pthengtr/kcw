import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { useContext } from "react";
import { NoteContext, NoteContextType } from "./NoteProvider";
import NoteTotalCard from "./NoteTotalCard";
import { supabase } from "@/app/lib/supabase";
import { noteType } from "../Transaction/TransactionProvider";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

export default function NoteSaveDialog() {
  const {
    noteBills,
    setNoteBills,
    getSumAfterTax,
    getSumFullAmount,
    noteDueDate,
    purchaseNoteNo,
    setPurchaseNoteNo,
    noteDiscount,
    setNoteDiscount,
    currentAccount,
    setCurrentAccount,
    updateNote,
    setUpdateNote,
  } = useContext(NoteContext) as NoteContextType;

  const { toast } = useToast();
  const pathName = usePathname();

  function formatNewNote(date: Date, data: noteType[]) {
    const billHeader = "KCW-BN";

    let newNoteId = Math.random().toString().substring(2, 14);

    const sequenceNumber =
      data.length === 0
        ? "0001"
        : (parseInt(data[0].NOTENO.split("-")[2]) + 1)
            .toString()
            .padStart(4, "0");

    let newNoteNo = "";

    if (pathName === "/sale-note") {
      newNoteNo =
        billHeader +
        date
          .toLocaleDateString("th-TH", { month: "2-digit", year: "2-digit" })
          .split("/")
          .reverse()
          .join("") +
        "-" +
        sequenceNumber;
    } else {
      newNoteNo = purchaseNoteNo;
    }

    if (!!updateNote) {
      console.log("update note");
      newNoteId = updateNote.noteId.toString();
      newNoteNo = updateNote.NOTENO;
      date = new Date(updateNote.NOTEDATE);
    }

    if (!!currentAccount?.accountId) {
      const newNote: noteType = {
        noteId: parseInt(newNoteId),
        accountId: currentAccount.accountId,
        BILLAMT: parseFloat(getSumFullAmount().replace(",", "")),
        DISCOUNT: parseFloat(noteDiscount !== "" ? noteDiscount : "0"),
        NETAMT: parseFloat(getSumAfterTax().replace(",", "")),
        NOTEDATE: date,
        DUEDATE: noteDueDate,
        NOTENO: newNoteNo,
      };
      return newNote;
    }
  }

  async function createNewNote(date: Date) {
    const firstDayOfMonthDate = new Date(date);
    const lastDayOfMonthDate = new Date(date);

    firstDayOfMonthDate.setHours(0, 0, 0);
    firstDayOfMonthDate.setDate(1);

    lastDayOfMonthDate.setHours(0, 0, 0);
    lastDayOfMonthDate.setDate(1);
    lastDayOfMonthDate.setMonth(date.getMonth() + 1);

    const query = supabase
      .from("notes")
      .select(`*`)
      .ilike(
        "NOTENO",
        `KCW-BN${date
          .toLocaleDateString("th-TH", { month: "2-digit", year: "2-digit" })
          .split("/")
          .reverse()
          .join("")}-%`
      )
      .lt("NOTEDATE", new Date(lastDayOfMonthDate).toLocaleDateString("en-US"))
      .gte(
        "NOTEDATE",
        new Date(firstDayOfMonthDate).toLocaleDateString("en-US")
      )
      .order("NOTEDATE", { ascending: false })
      .limit(1);

    const { data, error } = await query;

    if (error) {
      console.log(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง",
        action: <CancelSVG />,
        className: "text-xl",
      });
      return;
    }

    const newNote = formatNewNote(date, data);

    console.log(newNote);

    if (newNote?.NOTENO === "") {
      console.log("no note number");
      toast({
        title: "ไม่มีเลขที่ใบวางบิล",
        description: "กรุณาใส่เลขที่ใบวางบิล",
        action: <CancelSVG />,
        className: "text-xl",
      });
      return;
    }

    console.log(JSON.stringify(newNote));
    console.log(
      JSON.stringify(noteBills?.map((bill) => ({ billId: bill.billId })))
    );

    let rpcFunction = "fn_create_new_sale_note";

    if (!!updateNote) {
      rpcFunction = "fn_update_sale_note";
    }

    const { data: dataRpc, error: errorRpc } = await supabase.rpc(rpcFunction, {
      new_note: JSON.stringify(newNote),
      new_note_bills: JSON.stringify(
        noteBills?.map((bill) => ({ billId: bill.billId }))
      ),
    });

    console.log(dataRpc, errorRpc);

    if (!!errorRpc || dataRpc !== newNote?.NOTENO) {
      toast({
        title: !!errorRpc ? errorRpc.code : "เกิดข้อผิดพลาด",
        description: !!errorRpc ? errorRpc.message : dataRpc,
        action: <CancelSVG />,
        className: "text-xl",
      });
      return;
    } else {
      toast({
        title: !!dataRpc ? dataRpc : "",
        description: "บันทึกเรียบร้อยแล้ว",
        action: <CheckCircleSVG />,
        className: "text-xl",
      });

      setNoteBills(undefined);
      setNoteDiscount("");
      setCurrentAccount(undefined);
      setUpdateNote(undefined);
      setPurchaseNoteNo("");
      return;
    }
  }

  function handleConfirmNote() {
    createNewNote(new Date());
  }

  return (
    <Dialog>
      <DialogTrigger
        disabled={!noteBills || noteBills.length === 0}
        className="bg-secondary hover:bg-red-700 text-4xl py-10 shadow-md text-white rounded-md"
      >
        {"บันทึก"}
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-fit [&>button]:hidden">
        <DialogHeader className="p-4">
          <DialogTitle className="text-3xl flex flex-col gap-4">
            <span>ใบวางบิลลูกหนี้</span>

            <div className="text-xl flex gap-2 items-center">
              <span className="bg-green-700 rounded-md text-white px-1">
                {noteBills?.at(0)?.accounts?.ACCTNO}
              </span>
              <span>{noteBills?.at(0)?.accounts?.ACCTNAME}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <section className="w-[680px]">
          <NoteTotalCard />
        </section>

        <div className="grid grid-cols-2 gap-8">
          <DialogClose className="bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 p-2 rounded-lg">
            ยกเลิก
          </DialogClose>
          <DialogClose
            onClick={handleConfirmNote}
            className="bg-secondary hover:bg-red-700 font-bold text-white text-xl p-2 rounded-md"
          >
            ยืนยัน
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckCircleSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="42px"
      viewBox="0 -960 960 960"
      width="42px"
      fill="#12961d"
    >
      <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}

function CancelSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="42px"
      viewBox="0 -960 960 960"
      width="42px"
      fill="#d62c2c"
    >
      <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}
