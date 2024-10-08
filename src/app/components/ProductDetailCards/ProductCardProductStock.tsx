import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductStock({
  itemDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>สต๊อกสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        <SpanName>คงเหลือ</SpanName>
        <SpanValue>{itemDetail.QTYOH2}</SpanValue>
        <SpanName>LOW</SpanName>
        <SpanValue>{itemDetail.QTYMIN}</SpanValue>
        <SpanName>ORDER</SpanName>
        <SpanValue>{itemDetail.QTYGET}</SpanValue>
      </CardContent>
    </Card>
  );
}
