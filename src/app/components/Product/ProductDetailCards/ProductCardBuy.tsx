import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/app/lib/supabase";
import ProductCardLoading from "@/app/components/Product/ProductDetailCards/ProductCardLoading";
import { itemsType } from "@/app/components/Transaction/TransactionProvider";
import { createLastYearDate } from "@/app/components/Transaction/TransactionProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductBuySellFilter from "./ProductBuySellFilter";
import TotalCount from "@/app/components/TotalCount";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function ProductCardBuy({ productDetail }: ProductDetailProps) {
  const [productItems, setProductItems] = useState<itemsType[]>();
  const [isLoading, setIsLoading] = useState(true);

  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date>(createLastYearDate());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [limit, setLimit] = useState("50");
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("bills(JOURDATE)");
  const [sortAsc, setSortAsc] = useState(false);

  function handleClickColumn(column: string) {
    if (sortBy === column) {
      setSortAsc((cur) => !cur);
      return;
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  }

  const cardId = useId();
  useEffect(() => {
    async function getBillItems(bcode: string) {
      let query = supabase
        .from("items")
        .select(`*, bills!inner(*), accounts(*)`, { count: "exact" });

      if (filterText != "") {
        const searchWords = filterText
          .split(/[\s,]+/)
          .map((word) => word.trim());

        const orSearchArr = searchWords.map(
          (word) => `ACCTNO.ilike.%${word}%, ACCTNAME.ilike.%${word}%`
        );

        query = supabase
          .from("items")
          .select(`*, bills!inner(*), accounts!inner(*)`, { count: "exact" });

        orSearchArr.forEach(
          (orSearch) =>
            (query = query.or(orSearch, {
              referencedTable: "accounts",
            }))
        );
      }

      query = query
        .eq("BCODE", bcode)
        .ilike("bills.BILLTYPE", "%P%")
        .order(sortBy, { ascending: sortAsc })
        .lte("bills.JOURDATE", toDate.toLocaleString("en-US"))
        .gte("bills.JOURDATE", fromDate.toLocaleString("en-US"))
        .limit(parseInt(limit));

      const { data, error, count } = await query;

      setIsLoading(false);

      if (error) return;
      if (data !== null) setProductItems(data);
      if (count !== null) setTotalCount(count);
    }
    getBillItems(productDetail.BCODE);
  }, [productDetail, limit, fromDate, toDate, filterText, sortAsc, sortBy]);

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

    return (costnet * (isVat ? 1.07 : 1)) / numberPerQty;
  }

  const sumAmt = productItems?.reduce((acc, item) => item.AMOUNT + acc, 0);
  const sumQty = productItems?.reduce(
    (acc, item) => item.QTY * item.MTP + acc,
    0
  );
  const avgCost = productItems?.reduce((acc, item) => {
    return (
      calculateCostnet(
        [item.DISCNT1, item.DISCNT2, item.DISCNT3, item.DISCNT4],
        item.PRICE,
        item.MTP,
        item.accounts?.ACCTNO.charAt(0) === "7"
      ) /
        productItems.length +
      acc
    );
  }, 0);

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
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("bills(JOURDATE)")}
                    >
                      วันที่
                    </TableHead>
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("BILLNO")}
                    >
                      เลขที่บิล
                    </TableHead>
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("accounts(ACCTNAME)")}
                    >
                      บริษัท
                    </TableHead>
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("QTY")}
                    >
                      จำนวน
                    </TableHead>
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("PRICE")}
                    >
                      ทุน/หน่วย
                    </TableHead>
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("AMOUNT")}
                    >
                      ทุนรวม
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productItems &&
                    productItems.map((item, index) => (
                      <TableRow
                        className="even:bg-gray-100"
                        key={`${item.BILLNO}${cardId}${index}`}
                      >
                        <TableCell>
                          {new Date(item.bills?.BILLDATE).toLocaleDateString(
                            "th-TH"
                          )}
                        </TableCell>
                        <TableCell>{item.BILLNO}</TableCell>
                        <TableCell>{item.accounts?.ACCTNAME}</TableCell>
                        <TableCell className="text-right">
                          {item.QTY * item.MTP}
                        </TableCell>
                        <TableCell className="text-right">
                          {calculateCostnet(
                            [
                              item.DISCNT1,
                              item.DISCNT2,
                              item.DISCNT3,
                              item.DISCNT4,
                            ],
                            item.PRICE,
                            item.MTP,
                            item.accounts?.ACCTNO.charAt(0) === "7"
                          ).toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.AMOUNT.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
                  <TabsTrigger value="sumQty">ซื้อทั้งหมด</TabsTrigger>
                  <TabsTrigger value="avgCost">ทุนเฉลี่ย</TabsTrigger>
                  <TabsTrigger value="sumAmt">ทุนรวม</TabsTrigger>
                </TabsList>
                <TabsContent value="avgCost" className="w-24 text-center">
                  {avgCost?.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TabsContent>
                <TabsContent value="sumQty" className="w-24 text-center">
                  {sumQty?.toLocaleString()}
                </TabsContent>
                <TabsContent value="sumAmt" className="w-24 text-center">
                  {sumAmt?.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
