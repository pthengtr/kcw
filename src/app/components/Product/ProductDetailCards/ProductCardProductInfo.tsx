import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { groupName } from "@/app/lib/util";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductInfo({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        <SpanName>หมวดสินค้า</SpanName>
        <SpanValue>{groupName[productDetail.MAIN.toString()]}</SpanValue>
        <SpanName>รหัสสินค้า</SpanName>
        <SpanValue>{productDetail.BCODE}</SpanValue>
        <SpanName>ชื่อสินค้า</SpanName>
        <SpanValue>{productDetail.DESCR}</SpanValue>
        <SpanName>รุ่น</SpanName>
        <SpanValue>{productDetail.MODEL}</SpanValue>
        <SpanName>ยี่ห้อ</SpanName>
        <SpanValue>{productDetail.BRAND}</SpanValue>
        <SpanName>บริษัท</SpanName>
        <SpanValue>{productDetail.VENDOR}</SpanValue>
        <SpanName>ที่เก็บ</SpanName>
        <SpanValue>{productDetail.LOCATION1}</SpanValue>
        <Accordion type="single" className="col-span-2" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              ที่เก็บสำรอง
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_1fr] gap-1">
              <SpanName>LOCATION1</SpanName>
              <SpanValue>{productDetail.LOCATION1}</SpanValue>
              <SpanName>LOCATION2</SpanName>
              <SpanValue>{productDetail.LOCATION2}</SpanValue>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
