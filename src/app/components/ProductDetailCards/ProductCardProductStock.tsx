import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductStock({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>สต๊อกสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        <SpanName>คงเหลือ</SpanName>
        <SpanValue>{productDetail.QTYOH2}</SpanValue>
        <SpanName>LOW</SpanName>
        <SpanValue>{productDetail.QTYMIN}</SpanValue>
        <SpanName>ORDER</SpanName>
        <SpanValue>{productDetail.QTYGET}</SpanValue>
      </CardContent>
    </Card>
  );
}
