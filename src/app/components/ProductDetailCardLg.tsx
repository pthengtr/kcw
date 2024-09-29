import { ProductDetailProps, SpanValue, SpanName } from "./ProductDetail";
import React from "react";
//import ImageWithFallback from "./ImageWithFallback";
import { groupName } from "../lib/util";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDetailCardLg({ itemInfo }: ProductDetailProps) {
  return (
    <div className="grid gap-6 auto-rows-min xl:grid-cols-[auto_auto]">
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
          <SpanName>หมวดสินค้า</SpanName>
          <SpanValue>{groupName[itemInfo.MAIN.toString()]}</SpanValue>
          <SpanName>รหัสสินค้า</SpanName>
          <SpanValue>{itemInfo.BCODE}</SpanValue>
          <SpanName>ชื่อสินค้า</SpanName>
          <SpanValue>{itemInfo.DESCR}</SpanValue>
          <SpanName>รุ่น</SpanName>
          <SpanValue>{itemInfo.MODEL}</SpanValue>
          <SpanName>ยี่ห้อ</SpanName>
          <SpanValue>{itemInfo.BRAND}</SpanValue>
          <SpanName>บริษัท</SpanName>
          <SpanValue>{itemInfo.VENDOR}</SpanValue>
          <SpanName>ที่เก็บ</SpanName>
          <SpanValue>
            {itemInfo.LOCATION1}
            {itemInfo.location.map((item) => (
              <span key={item.Attribute}>, {item.Value}</span>
            ))}
          </SpanValue>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>เบอร์สินค้า</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_2fr] gap-y-1 gap-x-4">
          <SpanName>เบอร์ 1 (แท้)</SpanName>
          <SpanValue>{itemInfo.PCODE}</SpanValue>
          <SpanName>เบอร์ 2 (โรงงาน)</SpanName>
          <SpanValue>{itemInfo.MCODE}</SpanValue>
          <SpanName>เบอร์ 3 (ชื่อย่อ)</SpanName>
          <SpanValue>{itemInfo.ACODE}</SpanValue>
          <SpanName>เบอร์ 4 (กลุ่ม)</SpanName>
          <SpanValue>{itemInfo.XCODE}</SpanValue>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>รูปสินค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageWithFallback
            src={`https://pthengtr.github.io/kcw-product-pictures/pictures/${itemInfo.BCODE}.jpg`}
            alt={`kcw bcode ${itemInfo.BCODE} image`}
          />
        </CardContent>
      </Card> */}
    </div>
  );
}
