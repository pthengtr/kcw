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
  const [productItems, setProductItems] = useState<itemsType[]>();
  const [isLoading, setIsLoading] = useState(true);

  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState<Date>(createLastYearDate());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [limit, setLimit] = useState("50");
  const [totalCount, setTotalCount] = useState(0);

  const [sortBy, setSortBy] = useState("_bills(JOURDATE)");
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
        .from("_items")
        .select(`*, _bills!inner(*), _accounts(*)`, { count: "exact" });

      if (filterText != "") {
        const searchWords = filterText
          .split(/[\s,]+/)
          .map((word) => word.trim());

        const orSearchArr = searchWords.map(
          (word) => `ACCTNO.ilike.%${word}%, ACCTNAME.ilike.%${word}%`
        );

        query = supabase
          .from("_items")
          .select(`*, _bills!inner(*), _accounts!inner(*)`, { count: "exact" });

        orSearchArr.forEach(
          (orSearch) =>
            (query = query.or(orSearch, {
              referencedTable: "_accounts",
            }))
        );
      }

      query = query
        .eq("BCODE", bcode)
        .ilike("_bills.BILLTYPE", "%S%")
        .order(sortBy, { ascending: sortAsc })
        .lte("_bills.JOURDATE", toDate.toLocaleString())
        .gte("_bills.JOURDATE", fromDate.toLocaleString())
        .limit(parseInt(limit));

      const { data, error, count } = await query;

      setIsLoading(false);
      if (error) return;
      if (data !== null) setProductItems(data);
      if (count !== null) setTotalCount(count);
    }
    getSalesItems(itemDetail.BCODE);
  }, [itemDetail, limit, fromDate, toDate, filterText, sortBy, sortAsc]);

  const sumQty = productItems?.reduce(
    (acc, item) => parseInt(item.QTY) * parseInt(item.MTP) + acc,
    0
  );
  const avgPrice = productItems?.reduce(
    (acc, item) => parseFloat(item.PRICE) / productItems.length + acc,
    0
  );
  const sumAmt = productItems?.reduce(
    (acc, item) => parseFloat(item.AMOUNT) + acc,
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
                    <TableHead
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => handleClickColumn("_bills(JOURDATE)")}
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
                      onClick={() => handleClickColumn("_accounts(ACCTNAME)")}
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
                          {new Date(item._bills.BILLDATE).toLocaleDateString(
                            "th-TH"
                          )}
                        </TableCell>
                        <TableCell>{item.BILLNO}</TableCell>
                        <TableCell>{item._accounts?.ACCTNAME}</TableCell>
                        <TableCell className="text-right">
                          {parseInt(item.QTY) * parseInt(item.MTP)}
                        </TableCell>
                        <TableCell className="text-right">
                          {parseFloat(item.PRICE).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {parseFloat(item.AMOUNT).toLocaleString()}
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
                  {avgPrice?.toLocaleString()}
                </TabsContent>
                <TabsContent value="sumQty" className="w-24 text-center">
                  {sumQty?.toLocaleString()}
                </TabsContent>
                <TabsContent value="sumAmt" className="w-24 text-center">
                  {sumAmt?.toLocaleString()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
