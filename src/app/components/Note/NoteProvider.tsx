"use client";
import { createContext, useState } from "react";
import React from "react";
import {
  accountsType,
  billType,
  noteType,
} from "../Transaction/TransactionProvider";
import { itemsType } from "../Transaction/TransactionProvider";
import { supabase } from "@/app/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export type NoteContextType = {
  noteBills: billType[] | undefined;
  setNoteBills: (bills: billType[] | undefined) => void;
  noteDueDate: Date;
  setNoteDueDate: (date: Date) => void;
  noteDetailOpen: boolean;
  setNoteDetailOpen: (open: boolean) => void;
  purchaseNoteNo: string;
  setPurchaseNoteNo: (noteNo: string) => void;
  currentBill: billType | undefined;
  setCurrentBill: (bill: billType) => void;
  currentBillItems: itemsType[] | undefined;
  setCurrentBillItems: (items: itemsType[]) => void;
  currentAccount: accountsType | undefined;
  setCurrentAccount: (account: accountsType | undefined) => void;
  handleRemoveBill: (bill: billType) => void;
  handleAddBill: (bill: billType) => void;
  getSumBeforeTax: () => string;
  getSumAfterTax: () => string;
  getSumTax: () => string;
  getSumFullAmount: () => string;
  noteDiscount: string;
  setNoteDiscount: (discount: string) => void;
  updateNote: noteType | undefined;
  setUpdateNote: (note: noteType | undefined) => void;
  handleUpdateNote: (note: noteType) => void;
  handleDeleteNote: (note: noteType) => void;
  getNoteBillsSupabase: (noteId: string) => void;
};

export const NoteContext = createContext<NoteContextType | null>(null);

type NoteProviderProps = {
  children: React.ReactNode;
};

export default function NoteProvider({ children }: NoteProviderProps) {
  const [noteDiscount, setNoteDiscount] = useState("");
  const [noteBills, setNoteBills] = useState<billType[]>();
  const [noteDueDate, setNoteDueDate] = useState(new Date());
  const [purchaseNoteNo, setPurchaseNoteNo] = useState("");
  const [noteDetailOpen, setNoteDetailOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<billType>();
  const [currentBillItems, setCurrentBillItems] = useState<itemsType[]>();
  const [currentAccount, setCurrentAccount] = useState<accountsType>();
  const [updateNote, setUpdateNote] = useState<noteType>();

  const { toast } = useToast();

  function getSumFullAmount(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
          .reduce((acc, bill) => acc + bill.AFTERTAX, 0)
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumBeforeTax(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
          .reduce(
            (acc, bill) => acc + bill.BEFORETAX,
            noteDiscount !== "" ? -parseFloat(noteDiscount) : 0
          )
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumAfterTax(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
          .reduce(
            (acc, bill) => acc + bill.AFTERTAX,
            noteDiscount !== "" ? -parseFloat(noteDiscount) : 0
          )
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function getSumTax(bills?: billType[]) {
    if (!bills) {
      bills = noteBills;
    }
    return !!bills
      ? bills
          .reduce((acc, bill) => acc + bill.TAX, 0)
          .toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : "0.00";
  }

  function handleAddBill(bill: billType) {
    const newNoteBills =
      noteBills !== undefined ? [...noteBills, bill] : [bill];

    if (!!bill.accountId) {
      getAccountSupabase(bill.accountId.toString());
    }
    setNoteBills(newNoteBills);
  }

  function handleRemoveBill(bill: billType) {
    const newNoteBills = noteBills?.filter(
      (noteBill) => noteBill.billId != bill.billId
    );

    if (newNoteBills?.length === 0 && !updateNote) {
      setCurrentAccount(undefined);
    }
    setNoteBills(newNoteBills);
    setNoteDetailOpen(false);
  }

  async function getNoteBillsSupabase(noteId: string) {
    const { data, error } = await supabase
      .from("bills")
      .select(`*, vouchers(*), notes(*), accounts(*), bill_payment(*)`, {
        count: "exact",
      })
      .eq("noteId", noteId)
      .order("JOURDATE", { ascending: false })
      .limit(50);

    if (error) return;
    if (data !== null) setNoteBills(data);
  }

  async function getAccountSupabase(accountId: string) {
    const { data, error } = await supabase
      .from("accounts")
      .select(`*`)
      .eq("accountId", accountId)
      .limit(1);

    if (error) return;
    if (data !== null) setCurrentAccount(data[0]);
  }

  function handleUpdateNote(note: noteType) {
    setUpdateNote(note);
    setNoteDiscount(note.DISCOUNT.toString());
    getAccountSupabase(note.accountId?.toString());
    getNoteBillsSupabase(note.noteId.toString());
  }

  async function deleteNoteSupabase(note: noteType) {
    const rpcFunction = "fn_delete_note";

    const { data: dataRpc, error: errorRpc } = await supabase.rpc(rpcFunction, {
      delete_note_id: note.noteId.toString(),
    });

    console.log(dataRpc, errorRpc);

    if (!!errorRpc || dataRpc !== note.noteId.toString()) {
      toast({
        title: !!errorRpc ? errorRpc.code : "เกิดข้อผิดพลาด",
        description: !!errorRpc ? errorRpc.message : dataRpc,
        action: <CancelSVG />,
        className: "text-xl",
      });
    } else {
      toast({
        title: !!dataRpc ? dataRpc : "",
        description: "ลบใบวางบิลเรียบร้อยแล้ว",
        action: <CheckCircleSVG />,
        className: "text-xl",
      });
    }
  }

  function handleDeleteNote(note: noteType) {
    deleteNoteSupabase(note);
  }

  const value = {
    noteBills,
    setNoteBills,
    noteDueDate,
    setNoteDueDate,
    purchaseNoteNo,
    setPurchaseNoteNo,
    noteDetailOpen,
    setNoteDetailOpen,
    currentBill,
    setCurrentBill,
    currentBillItems,
    setCurrentBillItems,
    currentAccount,
    setCurrentAccount,
    handleRemoveBill,
    handleAddBill,
    getSumBeforeTax,
    getSumAfterTax,
    getSumTax,
    getSumFullAmount,
    noteDiscount,
    setNoteDiscount,
    updateNote,
    setUpdateNote,
    handleUpdateNote,
    handleDeleteNote,
    getNoteBillsSupabase,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
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
