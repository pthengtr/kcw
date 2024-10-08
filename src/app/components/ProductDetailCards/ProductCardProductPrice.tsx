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
  itemDetail,
}: ProductDetailProps) {
  let ui2text = "";
  itemDetail.productUnit.forEach((item) => {
    if (item.Attribute === "UI2") {
      ui2text = item.Value;
    }
  });
  return (
    <Card>
      <CardHeader className="grid place-content-center">
        <CardTitle>ราคาสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid place-content-center">
        <SpanValue className="text-5xl px-4 py-2">
          {parseFloat(itemDetail.PRICENET1).toLocaleString()}
        </SpanValue>
      </CardContent>

      <CardContent>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              ราคาพิเศษ
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
              {itemDetail.productPrice.map(
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
              {itemDetail.productPriceM.map((price) => (
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
