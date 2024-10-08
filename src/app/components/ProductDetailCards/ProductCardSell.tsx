import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "../ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../lib/supabase";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductCardLoading from "./ProductCardLoading";

type salesItemsType = {
  BILLNO: string;
  BCODE: string;
  QTY: string;
  UI: string;
  MTP: string;
  PRICE: string;
  DISCNT1: string;
  DISCNT2: string;
  DISCNT3: string;
  DISCNT4: string;
  AMOUNT: string;
  salesInfo: {
    customerId: string;
    JOURDATE: string;
    JOURTIME: string;
    BILLDATE: string;
    BILLNO: string;
    DEDUCT: string;
    BEFORETAX: string;
    VAT: string;
    AFTERTAX: string;
    CASHAMT: string;
    CHKAMT: string;
    DUEAMT: string;
    customer: {
      customerId: string;
      ACCTNO: string;
      ACCTNAME: string;
    };
  };
}[];

export default function ProductCardSale({ itemDetail }: ProductDetailProps) {
  const [itemSalesInfo, setItemSalesInfo] = useState<salesItemsType>();
  const [isLoading, setIsLoading] = useState(true);

  const cardId = useId();
  useEffect(() => {
    async function getSalesItems(bcode: string) {
      const { data, error } = await supabase
        .from("salesItems")
        .select(`*, salesInfo(*, customer(*))`)
        .eq("BCODE", bcode)
        .order("salesInfo(JOURDATE)", { ascending: false })
        .limit(100);

      setIsLoading(false);
      if (error) return;
      if (data !== null) {
        console.log(data);
        setItemSalesInfo(data);
      }
    }
    getSalesItems(itemDetail.BCODE);
  }, [itemDetail]);

  return (
    <Card className="max-h-fit">
      <CardHeader>
        <CardTitle>ประวัติขาย</CardTitle>
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
                      {new Date(sale.salesInfo.BILLDATE).toLocaleDateString(
                        "th-TH"
                      )}
                    </TableCell>
                    <TableCell>{sale.BILLNO}</TableCell>
                    <TableCell>{sale.salesInfo.customer.ACCTNAME}</TableCell>

                    <TableCell>
                      {parseFloat(sale.PRICE).toLocaleString()}
                    </TableCell>
                    <TableCell>{parseInt(sale.QTY)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
