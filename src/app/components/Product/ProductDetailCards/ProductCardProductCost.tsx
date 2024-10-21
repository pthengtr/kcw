import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductCardProductCost({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card className="shadow-md">
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
              <SpanValue>TBD</SpanValue>
              <SpanName>ราคาเต็ม</SpanName>
              <SpanValue>TBD</SpanValue>
            </AccordionContent>
          </AccordionItem>
          {productDetail.UI2 && (
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-gray-500">
                ทุนหน่วยใหญ่
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-[1fr_1fr] gap-1">
                <SpanName>{`${productDetail.MTP2} TBD/TBD`}</SpanName>
                <SpanValue>TBD</SpanValue>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
