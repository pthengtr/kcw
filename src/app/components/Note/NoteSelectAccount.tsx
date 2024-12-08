import { accountsType } from "../Transaction/TransactionProvider";
import { useContext, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NoteContext, NoteContextType } from "./NoteProvider";
import { usePathname } from "next/navigation";
import { getPlaceholderText } from "../Common/SelectAccount";
import { supabase } from "@/app/lib/supabase";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type unpaidAccountType = {
  accountId: string;
  count: number;
  sum: number;
  accounts: accountsType;
};

export default function NoteSelectAcount() {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<unpaidAccountType[]>();
  const [filterText, setFilterText] = useState("");

  const pathName = usePathname();
  const { currentAccount, setCurrentAccount, setNoteBills } = useContext(
    NoteContext
  ) as NoteContextType;

  function handleSheetOpen(open: boolean) {
    setIsOpen(open);
  }

  function handleSelectCustomer(account: accountsType) {
    setCurrentAccount(account);
    setNoteBills(undefined);
    setIsOpen(false);
  }

  useEffect(() => {
    async function getAccountUnpaidSupabase() {
      let query = supabase
        .from("bills")
        .select(`accountId, DUEAMT.count(),  DUEAMT.sum(), accounts!inner(*)`)
        .eq("accounts.ACCTTYPE", pathName === "/sale-note" ? "S" : "P")
        .ilike("BILLTYPE", `${pathName === "/sale-note" ? "1S%" : "1P%"}`)
        .neq("DUEAMT", 0)
        .neq("CANCELED", "Y")
        .is("noteId", null)
        .limit(500);

      if (filterText !== "") {
        query = query.or(
          `ACCTNAME.ilike.%${filterText}%, ACCTNO.ilike.%${filterText}%`,
          {
            referencedTable: "accounts",
          }
        );
      }

      const { data, error } = await query.returns<unpaidAccountType[]>();
      if (error) {
        console.log(error);
        return;
      }
      if (data !== null) {
        const sortedData = data.sort((a, b) => b.sum - a.sum);
        setAccounts(sortedData);
      }
    }

    if (isOpen) getAccountUnpaidSupabase();
  }, [isOpen, pathName, filterText]);

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger className="bg-gray-100 text-base p-2 rounded-md hover:bg-gray-200">
        {!!currentAccount ? (
          <>
            <span
              className={`${
                currentAccount.ACCTTYPE === "S" ? "bg-green-800" : "bg-red-800"
              } rounded-sm text-white px-1`}
            >
              {currentAccount.ACCTNO}
            </span>{" "}
            {currentAccount.ACCTNAME}
          </>
        ) : (
          <>{getPlaceholderText(pathName)}</>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-[40%] overflow-auto">
        <div className="w-full flex gap-4 justify-center">
          <Input
            className={`rounded-md w-56`}
            type="text"
            placeholder="ชื่อลูกค้า..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          ></Input>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อย่อ</TableHead>
              <TableHead>ชื่อลูกค้า</TableHead>
              <TableHead>ยังไม่วางบิล</TableHead>
              <TableHead>ยอดรวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!accounts &&
              accounts.map((account) => (
                <TableRow
                  key={account.accounts.accountId}
                  className={`${
                    currentAccount?.accountId === account.accounts.accountId
                      ? "bg-primary text-gray-100 hover:bg-primary hover:text-gray-100"
                      : ""
                  }`}
                  onClick={() => handleSelectCustomer(account.accounts)}
                >
                  <TableCell>{account.accounts.ACCTNO}</TableCell>
                  <TableCell>{account.accounts.ACCTNAME}</TableCell>
                  <TableCell className="text-right">{account.count}</TableCell>
                  <TableCell className="text-right">
                    {account.sum.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </SheetContent>
    </Sheet>
  );
}
