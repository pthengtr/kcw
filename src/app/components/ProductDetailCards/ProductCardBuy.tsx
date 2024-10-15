import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "../ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../lib/supabase";
import ProductCardLoading from "./ProductCardLoading";
import { itemsType } from "../Transaction/TransactionProvider";
import { createLastYearDate } from "../Transaction/TransactionProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductBuySellFilter from "./ProductBuySellFilter";
import TotalCount from "../TotalCount";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function ProductCardBuy({ itemDetail }: ProductDetailProps) {
  const [itemBillInfo, setItemBillInfo] = useState<itemsType[]>();
  const [isLoading, setIsLoading] = useState(true);

  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date>(createLastYearDate());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [limit, setLimit] = useState("50");
  const [totalCount, setTotalCount] = useState(0);

  const cardId = useId();
  useEffect(() => {
    async function getBillItems(bcode: string) {
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
        .ilike("_bills.BILLTYPE", "%P%")
        .order("_bills(JOURDATE)", { ascending: false })
        .lte("JOURDATE", toDate.toLocaleString())
        .gte("JOURDATE", fromDate.toLocaleString())
        .limit(parseInt(limit));

      const { data, error, count } = await query;

      setIsLoading(false);

      if (error) return;
      if (data !== null) setItemBillInfo(data);
      if (count !== null) setTotalCount(count);
    }
    getBillItems(itemDetail.BCODE);
  }, [itemDetail, limit, fromDate, toDate, filterText]);

  function calculateCostnet(
    [...discnt]: number[],
    cost: number,
    numberPerQty: number,
    isVat: boolean
  ) {
    const costnet = discnt.reduce(
      (acc, cur) => (acc * (100 - cur)) / 100,
      cost
    );
    return parseFloat(
      ((costnet * (isVat ? 1.07 : 1)) / numberPerQty).toFixed(2)
    ).toLocaleString();
  }

  const sumQty = itemBillInfo?.reduce(
    (acc, bill) => parseInt(bill.QTY) * parseInt(bill.MTP) + acc,
    0
  );
  const avgCost = itemBillInfo?.reduce(
    (acc, bill) =>
      parseFloat(
        calculateCostnet(
          [
            parseFloat(bill.DISCNT1 ? bill.DISCNT1 : "0"),
            parseFloat(bill.DISCNT2 ? bill.DISCNT2 : "0"),
            parseFloat(bill.DISCNT3 ? bill.DISCNT3 : "0"),
            parseFloat(bill.DISCNT4 ? bill.DISCNT4 : "0"),
          ],
          parseFloat(bill.PRICE ? bill.PRICE : "0"),
          parseFloat(bill.MTP ? bill.MTP : "0"),
          bill._accounts?.ACCTNO.charAt(0) === "7"
        )
      ) /
        itemBillInfo.length +
      acc,
    0
  );

  return (
    <Card className="max-h-fit">
      <CardHeader className="flex flex-row justify-around items-center">
        <CardTitle>ประวัติซื้อ</CardTitle>
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
                    <TableHead>บริษัท</TableHead>
                    <TableHead>ชื่อย่อ</TableHead>
                    <TableHead>ทุน/หน่วย</TableHead>
                    <TableHead>จำนวน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemBillInfo &&
                    itemBillInfo.map((bill, index) => (
                      <TableRow
                        className="even:bg-gray-100"
                        key={`${bill.BILLNO}${cardId}${index}`}
                      >
                        <TableCell>
                          {new Date(bill._bills?.BILLDATE).toLocaleDateString(
                            "th-TH"
                          )}
                        </TableCell>
                        <TableCell>{bill.BILLNO}</TableCell>
                        <TableCell>{bill._accounts?.ACCTNAME}</TableCell>
                        <TableCell>{bill._accounts?.ACCTNO}</TableCell>
                        <TableCell>
                          {calculateCostnet(
                            [
                              parseFloat(bill.DISCNT1 ? bill.DISCNT1 : "0"),
                              parseFloat(bill.DISCNT2 ? bill.DISCNT2 : "0"),
                              parseFloat(bill.DISCNT3 ? bill.DISCNT3 : "0"),
                              parseFloat(bill.DISCNT4 ? bill.DISCNT4 : "0"),
                            ],
                            parseFloat(bill.PRICE ? bill.PRICE : "0"),
                            parseFloat(bill.MTP ? bill.MTP : "0"),
                            bill._accounts?.ACCTNO.charAt(0) === "7"
                          )}
                        </TableCell>
                        <TableCell>
                          {parseInt(bill.QTY) * parseInt(bill.MTP)}
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
                  <TabsTrigger value="avgCost">ทุนเฉลี่ย</TabsTrigger>
                  <TabsTrigger value="sumQty">ซื้อทั้งหมด</TabsTrigger>
                </TabsList>
                <TabsContent value="avgCost" className="w-24 text-center">
                  {avgCost?.toFixed(2)}
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
