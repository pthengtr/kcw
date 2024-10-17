import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductCode({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>เบอร์สินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-y-1 gap-x-4">
        <SpanName>เบอร์ 1 (แท้)</SpanName>
        <SpanValue>{productDetail.PCODE}</SpanValue>
        <SpanName>เบอร์ 2 (โรงงาน)</SpanName>
        <SpanValue>{productDetail.MCODE}</SpanValue>
        <SpanName>เบอร์ 3 (ชื่อย่อ)</SpanName>
        <SpanValue>{productDetail.ACODE}</SpanValue>
        <SpanName>เบอร์ 4 (กลุ่ม)</SpanName>
        <SpanValue>{productDetail.XCODE}</SpanValue>
      </CardContent>
    </Card>
  );
}
