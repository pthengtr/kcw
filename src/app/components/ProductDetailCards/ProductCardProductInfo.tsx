import { SpanValue, SpanName } from "../ProductDetail";
import { groupName } from "../../lib/util";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductInfo({
  itemDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        <SpanName>หมวดสินค้า</SpanName>
        <SpanValue>{groupName[itemDetail.MAIN.toString()]}</SpanValue>
        <SpanName>รหัสสินค้า</SpanName>
        <SpanValue>{itemDetail.BCODE}</SpanValue>
        <SpanName>ชื่อสินค้า</SpanName>
        <SpanValue>{itemDetail.DESCR}</SpanValue>
        <SpanName>รุ่น</SpanName>
        <SpanValue>{itemDetail.MODEL}</SpanValue>
        <SpanName>ยี่ห้อ</SpanName>
        <SpanValue>{itemDetail.BRAND}</SpanValue>
        <SpanName>บริษัท</SpanName>
        <SpanValue>{itemDetail.VENDOR}</SpanValue>
        <SpanName>ที่เก็บ</SpanName>
        <SpanValue>{itemDetail.LOCATION1}</SpanValue>
        <Accordion type="single" className="col-span-2" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              ที่เก็บสำรอง
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_1fr] gap-1">
              {itemDetail.productLocation.map((item) => (
                <React.Fragment key={item.Attribute}>
                  <SpanName>{item.Attribute}</SpanName>
                  <SpanValue>{item.Value}</SpanValue>
                </React.Fragment>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
