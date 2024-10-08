import { useEffect, useId, useState } from "react";
import { ProductDetailProps } from "../ProductDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../lib/supabase";
import ProductCardLoading from "./ProductCardLoading";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type billItemsType = {
  AMOUNT: string;
  BCODE: string;
  BILLNO: string;
  DISCNT1: string;
  DISCNT2: string;
  DISCNT3: string;
  DISCNT4: string;
  MTP: string;
  PRICE: string;
  QTY: string;
  UI: string;
  billInfo: {
    BILLDATE: string;
    BILLNO: string;
    CASHAMT: string;
    CHKAMT: string;
    DUEAMT: string;
    JOURDATE: string;
    PAID: string;
    PO: string;
    REMARKS: string;
    supplier: {
      ACCTNO: string;
      ACCTNAME: string;
    };
  };
}[];

export default function ProductCardBuy({ itemDetail }: ProductDetailProps) {
  const [itemBillInfo, setItemBillInfo] = useState<billItemsType>();
  const [isLoading, setIsLoading] = useState(true);

  const cardId = useId();
  useEffect(() => {
    async function getBillItems(bcode: string) {
      const { data, error } = await supabase
        .from("billItems")
        .select(`*, billInfo(*, supplier(*))`)
        .eq("BCODE", bcode)
        .order("billInfo(JOURDATE)", { ascending: false });

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
                      {new Date(bill.billInfo.BILLDATE).toLocaleDateString(
                        "th-TH"
                      )}
                    </TableCell>
                    <TableCell>{bill.BILLNO}</TableCell>
                    <TableCell>{bill.billInfo.supplier.ACCTNAME}</TableCell>
                    <TableCell>{bill.billInfo.supplier.ACCTNO}</TableCell>
                    <TableCell>
                      {calculateCostnet(
                        [
                          parseFloat(bill.DISCNT1),
                          parseFloat(bill.DISCNT2),
                          parseFloat(bill.DISCNT3),
                          parseFloat(bill.DISCNT4),
                        ],
                        parseFloat(bill.PRICE),
                        parseFloat(bill.MTP),
                        bill.billInfo.supplier.ACCTNO.charAt(0) === "7"
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
