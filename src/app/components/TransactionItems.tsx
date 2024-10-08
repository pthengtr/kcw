import { useEffect, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TransactionContext,
  TransactionContextType,
} from "./TransactionProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { salesItemType } from "./TransactionBills";
import { SearchContext, SearchContextType } from "./SearchProvider";

type TransactionCustomerItemsProps = {
  customerId: string;
};

export default function TransactionCustomerItems({
  customerId,
}: TransactionCustomerItemsProps) {
  const [customerItems, setCustomerItems] = useState<salesItemType[]>();
  const { billNo, setBillNo } = useContext(
    TransactionContext
  ) as TransactionContextType;

  const { searchKey } = useContext(SearchContext) as SearchContextType;

  const isCustomer = searchKey === "customer" || searchKey === "salesInfo";
  const searchTableBill = isCustomer ? "salesItems" : "billItems";
  const searchId = isCustomer ? "customerId" : "supplierId";

  function handleClickAllItems() {
    setBillNo("");
  }

  useEffect(() => {
    async function getDataSupabase() {
      const query = supabase
        .from(searchTableBill)
        .select(`*, productInfo(*)`)
        .eq(
          billNo === "" ? searchId : "BILLNO",
          billNo === "" ? customerId : billNo
        )

        .order("JOURDATE", { ascending: false })
        .limit(100);

      const { data, error } = await query;

      if (error) return;
      if (data !== null) setCustomerItems(data);
    }

    if (customerId !== "") {
      getDataSupabase();
    } else {
      setCustomerItems(undefined);
      setBillNo("");
    }
  }, [customerId, billNo, searchId, searchTableBill, setBillNo]);

  return (
    <div className="p-8">
      {customerItems && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>{billNo === "" ? "สินค้าทั้งหมด" : billNo}</CardTitle>
            <Button
              onClick={handleClickAllItems}
              className="text-white bg-secondary hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] transition"
            >
              ดูสินค้าทั้งหมด
            </Button>
          </CardHeader>
          <CardContent>
            <Table className="h-96 block overflow-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่บิล</TableHead>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>หน่วย</TableHead>
                  <TableHead>ราคา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerItems.map((item, index) => (
                  <TableRow key={`${item.BILLNO}-${index}`}>
                    <TableCell>{item.BILLNO}</TableCell>
                    <TableCell>{item.BCODE}</TableCell>
                    <TableCell>{`${item.productInfo.DESCR}, ${item.productInfo.MODEL}`}</TableCell>
                    <TableCell>{item.QTY}</TableCell>
                    <TableCell>{item.UI}</TableCell>
                    <TableCell>{item.PRICE}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
