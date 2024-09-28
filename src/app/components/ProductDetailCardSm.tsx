import { ProductDetailProps, SpanValue, SpanName } from "./ProductDetail";
import { sizeCategory, sizeType } from "../lib/util";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetailSection2({
  itemInfo,
}: ProductDetailProps) {
  let ui1text = "",
    ui2text = "",
    ui2number = "";
  itemInfo.unit.forEach((item) => {
    if (item.Attribute === "UI1") {
      ui1text = item.Value;
    } else if (item.Attribute === "UI2") {
      ui2text = item.Value;
      ui2number = item.NumberPerUnit.toString();
    }
  });

  const productCost = itemInfo.productCost[0];
  const discountArray = ["DISCNT1", "DISCNT2", "DISCNT3", "DISCNT4"];

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-2 md:grid-cols-1 md:items-start md:auto-rows-min">
      <Card>
        <CardHeader>
          <CardTitle>ราคาสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_1fr] gap-2">
          <SpanName>ราคาหน้าร้าน</SpanName>
          <SpanValue>{itemInfo.PRICENET1}</SpanValue>
        </CardContent>

        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-gray-500">
                ราคาพิเศษ
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
                {itemInfo.price.map(
                  (price) =>
                    price.Attribute !== "PRICE1" && (
                      <React.Fragment key={price.Attribute}>
                        <SpanName>{price.Attribute}</SpanName>
                        <SpanValue>{price.Value}</SpanValue>
                      </React.Fragment>
                    )
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ทุนสินค้าล่าสุด</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_1fr] gap-2 ">
          <SpanName>ทุนสุทธิ</SpanName>
          <SpanValue>{productCost.COSTNET}</SpanValue>
        </CardContent>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-gray-500">
                รายละเอียดส่วนลด
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-[1fr_1fr] gap-1">
                <SpanName>ราคาเต็ม</SpanName>
                <SpanValue>{productCost.COSTSET1}</SpanValue>
                {discountArray.map((discount) => (
                  <React.Fragment key={discount}>
                    <SpanName>discount</SpanName>
                    <SpanValue>
                      {productCost[discount as keyof typeof productCost]}
                    </SpanValue>
                  </React.Fragment>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>สต๊อกสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
          <SpanName>คงเหลือ</SpanName>
          <SpanValue>{itemInfo.QTYOH2}</SpanValue>
          <SpanName>LOW</SpanName>
          <SpanValue>{itemInfo.QTYMIN}</SpanValue>
          <SpanName>ORDER</SpanName>
          <SpanValue>{itemInfo.QTYGET}</SpanValue>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>หน่วยสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
          <SpanName>ย่อย</SpanName>
          <SpanValue>{ui1text}</SpanValue>
          <SpanName>ใหญ่</SpanName>
          <SpanValue>{ui2text}</SpanValue>
          <SpanName>บรรจุ</SpanName>
          <SpanValue>{ui2number}</SpanValue>
        </CardContent>
      </Card>
      {itemInfo.CODE1 && Object.keys(sizeCategory).includes(itemInfo.CODE1) && (
        <Card>
          <CardHeader>
            <CardTitle>ขนาด</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
            <SpanName> {sizeType[itemInfo.CODE1.toString()][0]} </SpanName>
            <SpanValue> {itemInfo.SIZE1} </SpanValue>

            <SpanName>{sizeType[itemInfo.CODE1.toString()][1]}</SpanName>
            <SpanValue>{itemInfo.SIZE2}</SpanValue>

            {sizeType[itemInfo.CODE1.toString()][2] && (
              <>
                <SpanName>{sizeType[itemInfo.CODE1.toString()][2]}</SpanName>
                <SpanValue>{itemInfo.SIZE3}</SpanValue>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลล่าสุด</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
          <SpanName>ซื้อเข้า</SpanName>
          {itemInfo.DATEUPDATE !== null ? (
            <>
              <SpanName>ซื้อเข้า</SpanName>
              <SpanValue>
                {new Date(Date.parse(itemInfo.DATEUPDATE)).toLocaleDateString(
                  "th-TH"
                )}
              </SpanValue>
            </>
          ) : (
            <></>
          )}
          {itemInfo.DATEAUDIT !== null ? (
            <>
              <SpanName>เช็คสต๊อก</SpanName>
              <SpanValue>
                {new Date(Date.parse(itemInfo.DATEAUDIT)).toLocaleDateString(
                  "th-TH"
                )}
              </SpanValue>
            </>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>หมายเหตุ</CardTitle>
        </CardHeader>
        <CardContent>{itemInfo.REMARKS}</CardContent>
      </Card>
    </div>
  );
}
