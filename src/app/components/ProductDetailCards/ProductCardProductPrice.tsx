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

export default function ProductCardProductPrice({
  itemInfo,
}: ProductDetailProps) {
  let ui2text = "";
  itemInfo.productUnit.forEach((item) => {
    if (item.Attribute === "UI2") {
      ui2text = item.Value;
    }
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>ราคาสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_1fr] gap-2">
        <SpanName>ราคาหน้าร้าน</SpanName>
        <SpanValue>{parseFloat(itemInfo.PRICENET1).toLocaleString()}</SpanValue>
      </CardContent>

      <CardContent>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              ราคาพิเศษ
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
              {itemInfo.productPrice.map(
                (price) =>
                  price.Attribute !== "PRICE1" && (
                    <React.Fragment key={price.Attribute}>
                      <SpanName>{price.Attribute}</SpanName>
                      <SpanValue>
                        {parseFloat(price.Value).toLocaleString()}
                      </SpanValue>
                    </React.Fragment>
                  )
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-gray-500">
              {`ราคา${ui2text != "" ? ui2text : "หน่วยใหญ่"}`}
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
              {itemInfo.productPriceM.map((price) => (
                <React.Fragment key={price.Attribute}>
                  <SpanName>{price.Attribute}</SpanName>
                  <SpanValue>
                    {parseFloat(price.Value).toLocaleString()}
                  </SpanValue>
                </React.Fragment>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
