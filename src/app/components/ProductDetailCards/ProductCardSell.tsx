import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "../ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../lib/supabase";
import { itemsType } from "../Transaction/TransactionProvider";
import { createLastYearDate } from "../Transaction/TransactionProvider";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductCardLoading from "./ProductCardLoading";
import ProductBuySellFilter from "./ProductBuySellFilter";
import TotalCount from "../TotalCount";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductCardSale({ itemDetail }: ProductDetailProps) {
  const [itemSalesInfo, setItemSalesInfo] = useState<itemsType[]>();
  const [isLoading, setIsLoading] = useState(true);

  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date>(createLastYearDate());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [limit, setLimit] = useState("50");
  const [totalCount, setTotalCount] = useState(0);

  const cardId = useId();
  useEffect(() => {
    async function getSalesItems(bcode: string) {
      let query = supabase
        .from("_items")
        .select(`*, _bills!inner(*), _accounts(*)`, { count: "exact" });

      if (filterText != "") {
        query = supabase
          .from("_items")
          .select(`*, _bills!inner(*), _accounts!inner(*)`, { count: "exact" })
          .or(`ACCTNO.ilike.%${filterText}%, ACCTNAME.ilike.%${filterText}%`, {
            referencedTable: "_accounts",
          });
      }

      query = query
        .eq("BCODE", bcode)
        .ilike("_bills.BILLTYPE", "%S%")
        .order("_bills(JOURDATE)", { ascending: false })
        .lte("JOURDATE", toDate.toLocaleString())
        .gte("JOURDATE", fromDate.toLocaleString())
        .limit(parseInt(limit));

      const { data, error, count } = await query;

      setIsLoading(false);
      if (error) return;
      if (data !== null) setItemSalesInfo(data);
      if (count !== null) setTotalCount(count);
    }
    getSalesItems(itemDetail.BCODE);
  }, [itemDetail, limit, fromDate, toDate, filterText]);

  const sumQty = itemSalesInfo?.reduce(
    (acc, bill) => parseInt(bill.QTY) * parseInt(bill.MTP) + acc,
    0
  );
  const avgPrice = itemSalesInfo?.reduce(
    (acc, bill) => parseFloat(bill.PRICE) / itemSalesInfo.length + acc,
    0
  );

  return (
    <Card className="max-h-fit">
      <CardHeader className="flex flex-row items-center justify-around">
        <CardTitle>ประวัติขาย</CardTitle>
        <ProductBuySellFilter
          filterText={filterText}
          setFilterText={setFilterText}
          toDate={toDate}
          setToDate={setToDate}
          fromDate={fromDate}
          setFromDate={setFromDate}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ProductCardLoading />
        ) : (
          <div className="flex flex-col gap-2 h-96">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>เลขที่บิล</TableHead>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>ราคา/หน่วย</TableHead>
                    <TableHead>จำนวน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemSalesInfo &&
                    itemSalesInfo.map((sale, index) => (
                      <TableRow
                        className="even:bg-gray-100"
                        key={`${sale.BILLNO}${cardId}${index}`}
                      >
                        <TableCell>
                          {new Date(sale._bills.BILLDATE).toLocaleDateString(
                            "th-TH"
                          )}
                        </TableCell>
                        <TableCell>{sale.BILLNO}</TableCell>
                        <TableCell>{sale._accounts?.ACCTNAME}</TableCell>

                        <TableCell>
                          {parseFloat(sale.PRICE).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {parseInt(sale.QTY) * parseInt(sale.MTP)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="mt-2" />

            <div className="flex items-center justify-end">
              <TotalCount
                limit={limit}
                totalCount={totalCount}
                setLimit={setLimit}
              />
              <Tabs defaultValue="sumQty" className="flex gap-2 justify-end">
                <TabsList>
                  <TabsTrigger value="avgPrice">ราคาเฉลี่ย</TabsTrigger>
                  <TabsTrigger value="sumQty">ขายทั้งหมด</TabsTrigger>
                </TabsList>
                <TabsContent value="avgPrice" className="w-24 text-center">
                  {avgPrice?.toFixed(2)}
                </TabsContent>
                <TabsContent value="sumQty" className="w-24 text-center">
                  {sumQty?.toLocaleString()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
