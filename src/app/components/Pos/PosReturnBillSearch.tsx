import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchIcon } from "./PosSelectAccount";

import { supabase } from "@/app/lib/supabase";
import { useContext, useState } from "react";
import { billType, itemsType } from "../Transaction/TransactionProvider";
import { PosContext, PosContextType, posItemsType } from "./PosProvider";

export default function PosReturnBillSearch() {
  const [billList, setBillList] = useState<billType[] | undefined>();
  const [searchBill, setSearchBill] = useState("");

  const {
    setPosItems,
    currentReturnBill,
    setCurrentReturnBill,
    setCurrentCustomer,
  } = useContext(PosContext) as PosContextType;

  function handleUserKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (e.key === "ArrowDown") document.getElementById("menuindex-0")?.focus();
  }

  async function getBillItems(bill: billType) {
    const { data, error } = await supabase
      .from("items")
      .select(`*, products(*, prices(*), prices_m(*))`)
      .eq("billId", bill.billId)
      .order("JOURDATE", { ascending: false })
      .limit(100);

    if (error) return;
    if (data !== null) handleItemsToPosItems(data);
  }

  async function searchBills(search: string) {
    if (search === "") return;

    const query = supabase
      .from("bills")
      .select("*, accounts(*)")
      .ilike("BILLNO", `%${search}%`)
      .ilike("BILLTYPE", `1S%`)
      .order("JOURDATE", { ascending: false })
      //.gt("TAX", "0")
      .limit(10);

    const { data, error } = await query;

    console.log(data);

    if (error) return;
    if (data !== null) {
      setBillList(data);
    }
  }

  function handleItemsToPosItems(items: itemsType[]) {
    const newPosItems: posItemsType[] = items.map((item) => {
      return {
        BCODE: item.products.BCODE,
        DESCR: item.products.DESCR,
        MODEL: item.products.MODEL,
        QTY: item.QTY,
        UI1: item.products.UI1,
        UI2: item.products.UI2,
        MTP: item.MTP,
        prices: item.products.prices,
        prices_m: item.products.prices_m,
        ISVAT: item.products.ISVAT,
        atPrice: "PRICE1",
        atUnit: "UI1",
        isReturn: item.QTY > 0 ? true : false,
        returnPrice: item.PRICE,
        returnUnit: item.UI,
        returnQty: item.QTY,
        cost: 0,
        DISCNT1: 0,
        DISCNT2: 0,
        DISCNT3: 0,
        DISCNT4: 0,
      };
    });

    setPosItems(newPosItems);
  }

  function handleSelectBill(bill: billType) {
    setSearchBill("");
    setBillList(undefined);
    setCurrentReturnBill(bill);
    setCurrentCustomer(bill.accounts);
    getBillItems(bill);
  }

  function handleSearchBills(searchText: string) {
    setSearchBill(searchText);
    searchBills(searchText);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none bg-gray-100 font-semibold hover:bg-gray-200 rounded-md text-base p-2">
        {!!currentReturnBill ? currentReturnBill.BILLNO : "ค้นหาเลขที่บิล"}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex gap-2 items-center">
          <span className="text-gray-400">
            <SearchIcon />
          </span>
          <Input
            value={searchBill}
            onChange={(e) => handleSearchBills(e.target.value)}
            placeholder="เลขที่บิล..."
            onKeyDown={(e) => handleUserKeyPress(e)}
          />
        </DropdownMenuLabel>

        {billList &&
          billList.map((bill, index) => (
            <DropdownMenuItem
              id={`menuindex-${index}`}
              className="grid grid-cols-[auto_auto] gap-4"
              key={bill.billId}
              onClick={() => handleSelectBill(bill)}
            >
              <span>{bill.BILLNO}</span>
              <span>{bill.accounts?.ACCTNAME}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
