import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "../ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../lib/supabase";
import ProductCardLoading from "./ProductCardLoading";
import { itemsType } from "../Transaction/TransactionProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductCardBuy({ itemDetail }: ProductDetailProps) {
  const [itemBillInfo, setItemBillInfo] = useState<itemsType[]>();
  const [isLoading, setIsLoading] = useState(true);

  const cardId = useId();
  useEffect(() => {
    async function getBillItems(bcode: string) {
      const { data, error } = await supabase
        .from("_items")
        .select(`*, _bills!inner(*), _accounts(*)`)
        .eq("BCODE", bcode)
        .ilike("_bills.BILLTYPE", "%P%")
        .order("_bills(JOURDATE)", { ascending: false })
        .limit(100);

      setIsLoading(false);
      if (error) return;
      if (data !== null) {
        setItemBillInfo(data);
      }
    }
    getBillItems(itemDetail.BCODE);
  }, [itemDetail]);

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

  return (
    <Card className="max-h-fit">
      <CardHeader>
        <CardTitle>ประวัติซื้อ</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ProductCardLoading />
        ) : (
          <Table className="block max-h-80 overflow-auto">
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
        )}
      </CardContent>
    </Card>
  );
}
