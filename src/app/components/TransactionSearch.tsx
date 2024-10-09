"use client";

import { Input } from "@/components/ui/input";
import { SearchContext, SearchContextType } from "./SearchProvider";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { customerType, salesInfoType } from "./TransactionBills";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SpanValue } from "./ProductDetail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const transactionMenu = {
  salesInfo: "บิลขาย",
  customer: "ลูกค้า",
  billInfo: "บิลซื้อ",
  supplier: "เจ้าหนี้",
};

export default function TransactionSearch() {
  const [contactResult, setContactResult] = useState<customerType[]>();
  const [billResult, setBillResult] = useState<salesInfoType[]>();

  const {
    searchKey,
    setSearchKey,
    searchText,
    setSearchText,
    setTransactionCustomerId,
    setTransactionBillId,
  } = useContext(SearchContext) as SearchContextType;

  useEffect(() => {
    setSearchText("");
    setSearchKey("customer");
    setContactResult(undefined);
    setTransactionCustomerId("");
  }, [setSearchText, setSearchKey, setContactResult, setTransactionCustomerId]);

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);

    switch (searchKey) {
      case "supplier":
      case "customer": {
        searchContact(e.target.value);
        break;
      }
      case "billInfo":
      case "salesInfo": {
        searchBill(e.target.value);
        break;
      }
    }
  }

  function handleClickMode(menuKey: string) {
    setSearchKey(menuKey);
    setSearchText("");
    setContactResult(undefined);
    setTransactionCustomerId("");
  }

  function handleClickName(id: string, bill?: string) {
    setSearchText("");
    setContactResult(undefined);
    setBillResult(undefined);
    setTransactionCustomerId(id);
    if (bill) {
      setTransactionBillId(bill);
    } else {
      setTransactionBillId("");
    }
  }

  async function searchContact(search: string) {
    if (search === "") return;

    const searchWords = search
      .replaceAll(")", "")
      .split(/[\s,]+/)
      .map((word) => word.trim());

    let query = supabase
      .from(searchKey)
      .select("*", {
        count: "exact",
      })
      .order("ACCTNAME", { ascending: true })
      .limit(10);

    const orSearchArr = searchWords.map(
      (word) =>
        `ACCTNAME.ilike.%${word}%, \
         ACCTNO.ilike.%${word}%`
    );

    orSearchArr.forEach((orSearch) => (query = query.or(orSearch)));

    const { data, error } = await query;

    if (error) return;
    if (data !== null) {
      setContactResult(data);
      setBillResult(undefined);
    }
  }

  async function searchBill(search: string) {
    if (search === "") return;

    const searchWords = search
      .replaceAll(")", "")
      .split(/[\s,]+/)
      .map((word) => word.trim());

    let query = supabase
      .from(searchKey)
      .select("*", {
        count: "exact",
      })
      .order("JOURDATE", { ascending: false })
      .limit(10);

    const orSearchArr = searchWords.map((word) => `BILLNO.ilike.%${word}%`);

    orSearchArr.forEach((orSearch) => (query = query.or(orSearch)));

    const { data, error } = await query;

    if (error) return;
    if (data !== null) {
      setContactResult(undefined);
      setBillResult(data);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-gray-200 px-2 rounded-l-md focus:outline-none font-semibold shadow-lg">
          {transactionMenu[searchKey as keyof typeof transactionMenu]}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.keys(transactionMenu).map((menuKey) => (
            <DropdownMenuItem
              key={menuKey}
              onClick={() => handleClickMode(menuKey)}
            >
              {transactionMenu[menuKey as keyof typeof transactionMenu]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        className="rounded-r-md rounded-l-none flex-1"
        type="text"
        placeholder="รหัส หรือ ชื่อลูกค้า..."
        value={searchText}
        onChange={handleSearchTextChange}
      />

      {contactResult && contactResult.length > 0 && searchText && (
        <div className="absolute flex gap-4 w-[512px] bg-white bottom-0 translate-y-full shadow-md p-2 z-10">
          <Table>
            <TableBody>
              {contactResult.map((item, index) => (
                <TableRow
                  onClick={() =>
                    handleClickName(
                      item[`${searchKey}Id` as keyof typeof item].toString()
                    )
                  }
                  key={`${item.ACCTNO}-${index}`}
                >
                  <TableCell>
                    <SpanValue
                      className={`${
                        searchKey === "customer"
                          ? "bg-primary text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {item.ACCTNO}
                    </SpanValue>
                  </TableCell>
                  <TableCell>{item.ACCTNAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {billResult && billResult.length > 0 && searchText && (
        <div className="absolute flex gap-4 w-[500px] bg-white bottom-0 translate-y-full shadow-md p-2 z-10">
          <Table>
            <TableBody>
              {billResult.map((item, index) => (
                <TableRow
                  onClick={() =>
                    handleClickName(
                      item[
                        `${
                          searchKey === "customer" || searchKey === "salesInfo"
                            ? "customerId"
                            : "supplierId"
                        }` as keyof typeof item
                      ].toString(),
                      item.BILLNO
                    )
                  }
                  key={`${item.BILLNO}-${index}`}
                >
                  <TableCell>{item.BILLNO}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
