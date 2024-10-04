import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductCardProductCost({
  itemInfo,
}: ProductDetailProps) {
  const discountArray = ["DISCNT1", "DISCNT2", "DISCNT3", "DISCNT4"];
  let ui1text = "",
    ui2text = "",
    ui2number = "";
  itemInfo.productUnit.forEach((item) => {
    if (item.Attribute === "UI1") {
      ui1text = item.Value;
    } else if (item.Attribute === "UI2") {
      ui2text = item.Value;
      ui2number = item.NumberPerUnit.toString();
    }
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>ทุนสินค้าล่าสุด</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              รายละเอียดทุน
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_1fr] gap-1">
              <SpanName>ทุนสุทธิ</SpanName>
              <SpanValue>
                {parseFloat(itemInfo.productCost.COSTNET).toLocaleString()}
              </SpanValue>
              <SpanName>ราคาเต็ม</SpanName>
              <SpanValue>
                {parseFloat(itemInfo.productCost.COSTSET1).toLocaleString()}
              </SpanValue>
              {discountArray.map((discount) => (
                <React.Fragment key={discount}>
                  <SpanName>discount</SpanName>
                  <SpanValue>
                    {parseFloat(
                      itemInfo.productCost[
                        discount as keyof typeof itemInfo.productCost
                      ]
                    ).toLocaleString()}
                  </SpanValue>
                </React.Fragment>
              ))}
            </AccordionContent>
          </AccordionItem>
          {ui2number && (
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-gray-500">
                ทุนหน่วยใหญ่
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-[1fr_1fr] gap-1">
                <SpanName>{`${ui2number} ${ui1text}/${ui2text}`}</SpanName>
                <SpanValue>
                  {parseFloat(
                    (
                      parseFloat(itemInfo.productCost.COSTNET) *
                      parseFloat(ui2number)
                    ).toFixed(2)
                  ).toLocaleString()}
                </SpanValue>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
