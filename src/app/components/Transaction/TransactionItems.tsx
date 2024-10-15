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

  const { toDate, fromDate, filterText, handleClickBill } = useContext(
    TransactionContext
  ) as TransactionContextType;

  useEffect(() => {
    async function getAccountItemsSupabase() {
      let query;

      if (filterText === "") {
        query = supabase
          .from("_items")
          .select(`*, productInfo!inner(*), _bills!inner(*)`, {
            count: "exact",
          });
      } else {
        query = supabase
          .from("_items")
          .select(`*, productInfo!inner(*)`, { count: "exact" })
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
        .order("JOURDATE", { ascending: false })
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
  ]);

  return (
    <>
      {accountItems && (
        <div className="h-[80vh] flex flex-col gap-4">
          <div className="w-full h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>หน่วย</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>ส่วนลด</TableHead>
                  <TableHead>จำนวนเงิน</TableHead>
                  <TableHead>เลขที่บิล</TableHead>
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
