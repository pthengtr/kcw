import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { itemsType } from "./TransactionProvider";

type TransactionCustomerItemsProps = {
  accountId: string;
};

export default function TransactionItems({
  accountId,
}: TransactionCustomerItemsProps) {
  const [accountItems, setAccountItems] = useState<itemsType[]>();

  useEffect(() => {
    async function getAccountItemsSupabase() {
      const query = supabase
        .from("_items")
        .select(`*, productInfo(*)`)
        .eq("accountId", accountId)

        .order("JOURDATE", { ascending: false })
        .limit(100);

      const { data, error } = await query;

      if (error) return;
      if (data !== null) setAccountItems(data);
    }

    getAccountItemsSupabase();
  }, [setAccountItems, accountId]);

  return (
    <>
      {accountItems && (
        <div className="w-full h-[75vh] overflow-auto">
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
                  <TableCell>{parseInt(item.QTY)}</TableCell>
                  <TableCell>{item.UI}</TableCell>
                  <TableCell>
                    {parseFloat(item.PRICE).toLocaleString()}
                  </TableCell>
                  <TableCell>{item.DISCNT1}</TableCell>
                  <TableCell>
                    {parseFloat(item.AMOUNT).toLocaleString()}
                  </TableCell>
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
