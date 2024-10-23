"use client";

import { Input } from "@/components/ui/input";
import { SearchContext, SearchContextType } from "../SearchProvider";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { accountsType } from "./TransactionProvider";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SpanValue } from "../Product/ProductDetail";
import { usePathname } from "next/navigation";

export default function TransactionSearch() {
  const [accountsResult, setAccountsResult] = useState<accountsType[]>();
  const [keyboardCursor, setKeyboardCursor] = useState(0);
  const [accountsFound, setAccountsFound] = useState(0);

  const path = usePathname();
  const acctType = path === "/sales" ? "S" : path === "/purchases" ? "P" : "";

  const {
    setSearchKey,
    searchText,
    setSearchText,
    setTransactionAccountObject,
  } = useContext(SearchContext) as SearchContextType;

  useEffect(() => {
    setSearchText("");
    setSearchKey("accounts");
    setAccountsResult(undefined);
    setTransactionAccountObject(undefined);
  }, [
    setSearchText,
    setSearchKey,
    setAccountsResult,
    setTransactionAccountObject,
  ]);

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const found = accountsFound > 10 ? 10 : accountsFound;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setKeyboardCursor((cur) => (cur < found - 1 ? cur + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setKeyboardCursor((cur) => (cur > 0 ? cur - 1 : found - 1));
    } else if (e.key === "Enter") {
      if (!!accountsResult) {
        handleClickAccount(accountsResult[keyboardCursor]);
      }
    }
  };

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
    searchAccounts(e.target.value);
  }

  function handleClickAccount(account: accountsType) {
    setSearchText("");
    setAccountsResult(undefined);
    setTransactionAccountObject(account);
  }

  async function searchAccounts(search: string) {
    if (search === "") return;

    const searchWords = search
      .replaceAll(")", "")
      .split(/[\s,]+/)
      .map((word) => word.trim());

    let query = supabase
      .from("accounts")
      .select("*", {
        count: "exact",
      })
      .order("ACCTNAME", { ascending: true })
      .limit(10);

    if (acctType !== "") query = query.eq("ACCTTYPE", acctType);

    const orSearchArr = searchWords.map(
      (word) =>
        `ACCTNAME.ilike.%${word}%, \
         ACCTNO.ilike.%${word}%`
    );

    orSearchArr.forEach((orSearch) => (query = query.or(orSearch)));

    const { data, error, count } = await query;

    if (error) return;
    if (data !== null) setAccountsResult(data);
    if (count !== null) setAccountsFound(count);
  }

  return (
    <>
      <Input
        className="rounded-md flex-1"
        type="text"
        placeholder={
          acctType === "P"
            ? "รหัส หรือ ชื่อเจ้าหนี้..."
            : "รหัส หรือ ชื่อลูกค้า..."
        }
        value={searchText}
        onChange={handleSearchTextChange}
        onKeyDown={handleUserKeyPress}
      />

      {accountsResult && accountsResult.length > 0 && searchText && (
        <div className="absolute flex gap-4 w-[512px] bg-white bottom-0 translate-y-full shadow-md z-10">
          <Table>
            <TableBody>
              {accountsResult.map((item, index) => (
                <TableRow
                  onClick={() => handleClickAccount(item)}
                  key={`${item.ACCTNO}-${index}`}
                  className={`${index === keyboardCursor ? "bg-gray-100" : ""}`}
                >
                  <TableCell>
                    <SpanValue
                      className={`text-white ${
                        item?.ACCTTYPE === "P"
                          ? "bg-red-900"
                          : item?.ACCTTYPE === "S"
                          ? "bg-green-900"
                          : ""
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
    </>
  );
}
