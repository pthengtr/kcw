"use client";

import { Input } from "@/components/ui/input";
import { SearchContext, SearchContextType } from "../SearchProvider";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { accountsType } from "./TransactionProvider";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SpanValue } from "../ProductDetail";

export default function TransactionSearch() {
  const [accountsResult, setAccountsResult] = useState<accountsType[]>();

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
      .from("_accounts")
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
      setAccountsResult(data);
    }
  }

  return (
    <>
      <Input
        className="rounded-md flex-1"
        type="text"
        placeholder="รหัส ชื่อลูกค้า หรือเจ้าหนี้..."
        value={searchText}
        onChange={handleSearchTextChange}
      />

      {accountsResult && accountsResult.length > 0 && searchText && (
        <div className="absolute flex gap-4 w-[512px] bg-white bottom-0 translate-y-full shadow-md p-2 z-10">
          <Table>
            <TableBody>
              {accountsResult.map((item, index) => (
                <TableRow
                  onClick={() => handleClickAccount(item)}
                  key={`${item.ACCTNO}-${index}`}
                >
                  <TableCell>
                    <SpanValue
                      className={`text-white ${
                        item?.ACCTNO.slice(-1) === "P"
                          ? "bg-red-900"
                          : item?.ACCTNO.slice(-1) === "S"
                          ? "bg-green-900"
                          : "bg-primary"
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
