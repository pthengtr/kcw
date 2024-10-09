import { useEffect, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";

//import { format } from "date-fns";
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

    console.log("render", billNo);
    if (customerId !== "") {
      getDataSupabase();
    } else {
      setCustomerItems(undefined);
      setBillNo("");
    }
  }, [customerId, billNo, searchId, searchTableBill, setBillNo]);

  return (
    <>
      {customerItems && (
        <>
          <div className="flex justify-between py-4 px-8">
            <span className="font-semibold text-2xl">{`รายการสินค้า${
              billNo === "" ? "ทั้งหมด" : ` ${billNo}`
            }`}</span>
            <Button
              onClick={handleClickAllItems}
              className="text-white bg-secondary hover:bg-secondary hover:bg-red-800 active:bg-secondary transition"
            >
              ดูสินค้าทั้งหมด
            </Button>
          </div>
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
                {customerItems.map((item, index) => (
                  <TableRow key={`${item.BILLNO}-${index}`}>
                    <TableCell>
                      {new Date(item.JOURDATE).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>{item.BCODE}</TableCell>
                    <TableCell>{`${item.productInfo.DESCR}, ${item.productInfo.MODEL}`}</TableCell>
                    <TableCell>{item.QTY}</TableCell>
                    <TableCell>{item.UI}</TableCell>
                    <TableCell>{item.PRICE}</TableCell>
                    <TableCell>{item.DISCNT1}</TableCell>
                    <TableCell>{item.AMOUNT}</TableCell>
                    <TableCell>{item.BILLNO}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
