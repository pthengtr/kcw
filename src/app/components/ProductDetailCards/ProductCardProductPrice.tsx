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
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader className="grid place-content-center">
        <CardTitle>ราคาสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid place-content-center">
        <SpanValue className="text-5xl px-4 py-2">
          {productDetail.PRICE1.toLocaleString()}
        </SpanValue>
      </CardContent>

      <CardContent>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              ราคาพิเศษ
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
              <SpanName>PRICE1</SpanName>
              <SpanValue>{productDetail.PRICE1}</SpanValue>
              <SpanName>PRICE2</SpanName>
              <SpanValue>{productDetail.PRICE2}</SpanValue>
              <SpanName>PRICE3</SpanName>
              <SpanValue>{productDetail.PRICE3}</SpanValue>
              <SpanName>PRICE4</SpanName>
              <SpanValue>{productDetail.PRICE4}</SpanValue>
              <SpanName>PRICE5</SpanName>
              <SpanValue>{productDetail.PRICE5}</SpanValue>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-gray-500">
              {`ราคา${
                productDetail.UI2 != "" ? productDetail.UI2 : "หน่วยใหญ่"
              }`}
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
              <SpanName>PRICEM1</SpanName>
              <SpanValue>{productDetail.PRICEM1}</SpanValue>
              <SpanName>PRICEM2</SpanName>
              <SpanValue>{productDetail.PRICEM2}</SpanValue>
              <SpanName>PRICEM3</SpanName>
              <SpanValue>{productDetail.PRICEM3}</SpanValue>
              <SpanName>PRICEM4</SpanName>
              <SpanValue>{productDetail.PRICEM4}</SpanValue>
              <SpanName>PRICEM5</SpanName>
              <SpanValue>{productDetail.PRICEM5}</SpanValue>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
