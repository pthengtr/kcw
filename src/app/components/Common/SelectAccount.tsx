import { accountsType } from "../Transaction/TransactionProvider";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
import { usePathname } from "next/navigation";

type SelectAccountProps = {
  currentCustomer: accountsType | undefined;
  handleSelectCustomer: (account: accountsType) => void;
};

export default function SelectAcount({
  currentCustomer,
  handleSelectCustomer,
}: SelectAccountProps) {
  const [searchCustomer, setSearchCustomer] = useState("");
  const [customerList, setCustomerList] = useState<
    accountsType[] | undefined
  >();

  const pathName = usePathname();

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "ArrowDown") document.getElementById("menuindex-0")?.focus();
  };

  function handleSearchCustomer(searchText: string) {
    setSearchCustomer(searchText);
    searchAccounts(searchText);
  }

  function _handleSelectCustomer(account: accountsType) {
    setSearchCustomer("");
    setCustomerList(undefined);
    handleSelectCustomer(account);
  }

  function getAccountType() {
    let accountType;

    switch (pathName) {
      case "/pos":
      case "/sale-note":
        accountType = "S";
        break;
      case "/purchase":
      case "/purchase-note":
        accountType = "P";
        break;
    }

    return accountType;
  }

  function getPlaceholderText() {
    let placeholderText;

    switch (pathName) {
      case "/pos":
      case "/sale-note":
        placeholderText = "ค้นหาลูกค้า..";
        break;
      case "/purchase":
      case "/purchase-note":
        placeholderText = "ค้นหาบริษัท..";
        break;
    }

    return placeholderText;
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
      .eq("ACCTTYPE", getAccountType())
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
      setCustomerList(data);
    }
  }
  return (
    <div className="flex gap-2 justify-start items-center text-xl">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none ">
          {!!currentCustomer ? (
            <>
              <span
                className={`${
                  currentCustomer.ACCTTYPE === "S"
                    ? "bg-green-800"
                    : "bg-red-800"
                } rounded-sm text-white px-1`}
              >
                {currentCustomer.ACCTNO}
              </span>{" "}
              {currentCustomer.ACCTNAME}
            </>
          ) : (
            <>{getPlaceholderText()}</>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex gap-2 items-center">
            <span className="text-gray-400">
              <SearchIcon />
            </span>
            <Input
              value={searchCustomer}
              onChange={(e) => handleSearchCustomer(e.target.value)}
              placeholder="ชื่อลูกค้า..."
              onKeyDown={(e) => handleUserKeyPress(e)}
            />
          </DropdownMenuLabel>

          {customerList &&
            customerList.map((customer, index) => (
              <DropdownMenuItem
                id={`menuindex-${index}`}
                className="flex gap-2"
                key={customer.accountId}
                onClick={() => _handleSelectCustomer(customer)}
              >
                <span
                  className={`${
                    customer.ACCTTYPE === "S" ? "bg-green-800" : "bg-red-800"
                  } rounded-sm text-white px-1`}
                >
                  {customer.ACCTNO}
                </span>
                <span>{customer.ACCTNAME}</span>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentcolor"
    >
      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  );
}