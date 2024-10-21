import { useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  itemsType,
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import TransactionTotalCount from "../TotalCount";

type TransactionCustomerItemsProps = {
  accountId: string;
};

export default function TransactionItems({
  accountId,
}: TransactionCustomerItemsProps) {
  const [accountItems, setAccountItems] = useState<itemsType[]>();
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState("50");

  const [sortBy, setSortBy] = useState("JOURDATE");
  const [sortAsc, setSortAsc] = useState(false);

  const { toDate, fromDate, filterText, handleClickBill } = useContext(
    TransactionContext
  ) as TransactionContextType;

  function handleClickColumn(column: string) {
    if (sortBy === column) {
      setSortAsc((cur) => !cur);
      return;
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  }

  useEffect(() => {
    async function getAccountItemsSupabase() {
      let query = supabase.from("items").select(`*, products(*), bills(*)`, {
        count: "exact",
      });

      if (filterText !== "") {
        const searchWords = filterText
          .split(/[\s,]+/)
          .map((word) => word.trim());

        console.log(searchWords);
        const orSearchArr = searchWords.map(
          (word) => ` \
      BCODE.ilike.%${word}%, \
      DESCR.ilike.%${word}%, \
      XCODE.ilike.%${word}%, \
      MCODE.ilike.%${word}%, \
      PCODE.ilike.%${word}%, \
      ACODE.ilike.%${word}%, \
      BRAND.ilike.%${word}%, \
      MODEL.ilike.%${word}%, \
      VENDOR.ilike.%${word}%`
        );

        console.log(orSearchArr);
        query = supabase
          .from("items")
          .select(`*, products!inner(*),  bills(*)`, {
            count: "exact",
          });

        orSearchArr.forEach(
          (orSearch) =>
            (query = query.or(orSearch, {
              referencedTable: "products",
            }))
        );
      }

      query = query
        .eq("accountId", accountId)
        .lte("JOURDATE", toDate.toLocaleString("en-US"))
        .gte("JOURDATE", fromDate.toLocaleString("en-US"))
        .order(sortBy, { ascending: sortAsc, nullsFirst: sortAsc })
        .limit(parseInt(limit));

      const { data, error, count } = await query;

      console.log(data);
      if (error) return;
      if (data !== null) setAccountItems(data);
      if (count !== null) setTotalCount(count);
    }

    getAccountItemsSupabase();
  }, [
    setAccountItems,
    accountId,
    fromDate,
    toDate,
    filterText,
    setTotalCount,
    limit,
    sortAsc,
    sortBy,
  ]);

  const sumAmt = accountItems
    ? accountItems.reduce((acc, item) => item.AMOUNT + acc, 0)
    : 0;

  return (
    <>
      {accountItems && (
        <div className="h-[80vh] flex flex-col gap-4">
          <div className="w-full h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("JOURDATE")}
                  >
                    วันที่
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("BCODE")}
                  >
                    รหัสสินค้า
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("productInfo(DESCR)")}
                  >
                    ชื่อสินค้า
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("QTY")}
                  >
                    จำนวน
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("UI")}
                  >
                    หน่วย
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("PRICE")}
                  >
                    ราคา
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("DISCNT1")}
                  >
                    ส่วนลด
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("AMOUNT")}
                  >
                    จำนวนเงิน
                  </TableHead>
                  <TableHead
                    className="hover:underline hover:cursor-pointer"
                    onClick={() => handleClickColumn("bills(BILLNO)")}
                  >
                    เลขที่บิล
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountItems.map((item, index) => (
                  <TableRow key={`${item.BILLNO}-${index}`}>
                    <TableCell>
                      {new Date(item.JOURDATE).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>{item.BCODE}</TableCell>
                    <TableCell>
                      {item.products
                        ? `${item.products.DESCR}, ${item.products.MODEL}`
                        : ""}
                    </TableCell>
                    <TableCell>{item.QTY}</TableCell>
                    <TableCell>{item.UI}</TableCell>
                    <TableCell>
                      {item.PRICE.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {item.DISCNT1.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {item.AMOUNT.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      onClick={() => handleClickBill(item.BILLNO)}
                      className={`${"hover:cursor-pointer hover:underline hover:italic"}`}
                    >
                      {item.BILLNO}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-4 justify-end items-center">
            <div className="flex gap-2">
              <span>จำนวนเงินทั้งหมด</span>
              <span className="font-semibold">
                {sumAmt.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <TransactionTotalCount
              totalCount={totalCount}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        </div>
      )}
    </>
  );
}
