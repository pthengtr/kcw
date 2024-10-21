import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/app/lib/supabase";
import { itemsType } from "@/app/components/Transaction/TransactionProvider";
import { createLastYearDate } from "@/app/components/Transaction/TransactionProvider";
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
import TotalCount from "@/app/components/TotalCount";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductCardSale({ productDetail }: ProductDetailProps) {
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
    async function getSalesItems(bcode: string) {
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
        .ilike("bills.BILLTYPE", "%S%")
        .order(sortBy, { ascending: sortAsc })
        .lte("bills.JOURDATE", toDate.toLocaleString("en-SG"))
        .gte("bills.JOURDATE", fromDate.toLocaleString("en-SG"))
        .limit(parseInt(limit));

      const { data, error, count } = await query;

      setIsLoading(false);
      if (error) return;
      if (data !== null) setProductItems(data);
      if (count !== null) setTotalCount(count);
    }
    getSalesItems(productDetail.BCODE);
  }, [productDetail, limit, fromDate, toDate, filterText, sortBy, sortAsc]);

  const sumQty = productItems?.reduce(
    (acc, item) => item.QTY * item.MTP + acc,
    0
  );
  const avgPrice = productItems?.reduce(
    (acc, item) => item.PRICE / productItems.length + acc,
    0
  );
  const sumAmt = productItems?.reduce((acc, item) => item.AMOUNT + acc, 0);

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
                      ลูกค้า
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
                      ราคา/หน่วย
                    </TableHead>
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("AMOUNT")}
                    >
                      ราคารวม
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
                          {new Date(item.bills.BILLDATE).toLocaleDateString(
                            "th-TH"
                          )}
                        </TableCell>
                        <TableCell>{item.BILLNO}</TableCell>
                        <TableCell>{item.accounts?.ACCTNAME}</TableCell>
                        <TableCell className="text-right">
                          {item.QTY * item.MTP}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.PRICE.toLocaleString("th-TH", {
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
                  <TabsTrigger value="sumQty">ขายทั้งหมด</TabsTrigger>
                  <TabsTrigger value="avgPrice">ราคาเฉลี่ย</TabsTrigger>
                  <TabsTrigger value="sumAmt">ราคารวม</TabsTrigger>
                </TabsList>
                <TabsContent value="avgPrice" className="w-24 text-center">
                  {avgPrice?.toLocaleString("th-TH", {
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
