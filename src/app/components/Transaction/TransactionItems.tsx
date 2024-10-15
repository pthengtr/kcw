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
      let query;

      if (filterText === "") {
        query = supabase.from("_items").select(`*, productInfo(*), _bills(*)`, {
          count: "exact",
        });
      } else {
        query = supabase
          .from("_items")
          .select(`*, productInfo!inner(*),  _bills(*)`, {
            count: "exact",
          })
          .or(
            `DESCR.ilike.%${filterText}%, MODEL.ilike.%${filterText}%, BCODE.ilike.%${filterText}%`,
            {
              referencedTable: "productInfo",
            }
          );
      }

      query = query
        .eq("accountId", accountId)
        .lte("JOURDATE", toDate.toLocaleString())
        .gte("JOURDATE", fromDate.toLocaleString())
        .order(sortBy, { ascending: sortAsc, nullsFirst: sortAsc })
        .limit(parseInt(limit));

      const { data, error, count } = await query;

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
                    onClick={() => handleClickColumn("_bills(BILLNO)")}
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
                      {item.productInfo
                        ? `${item.productInfo.DESCR}, ${item.productInfo.MODEL}`
                        : ""}
                    </TableCell>
                    <TableCell>{parseInt(item.QTY ? item.QTY : "0")}</TableCell>
                    <TableCell>{item.UI}</TableCell>
                    <TableCell>
                      {parseFloat(
                        item.PRICE ? item.PRICE : "0"
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{item.DISCNT1}</TableCell>
                    <TableCell>
                      {parseFloat(
                        item.AMOUNT ? item.AMOUNT : "0"
                      ).toLocaleString()}
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
          <TransactionTotalCount
            totalCount={totalCount}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      )}
    </>
  );
}
