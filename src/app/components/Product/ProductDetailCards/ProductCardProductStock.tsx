import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductStock({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>สต๊อกสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        <SpanName>คงเหลือ</SpanName>
        <SpanValue>{productDetail.inventory.QTYOH2}</SpanValue>
        <SpanName>LOW</SpanName>
        <SpanValue>{productDetail.inventory.QTYMIN}</SpanValue>
        <SpanName>ORDER</SpanName>
        <SpanValue>{productDetail.inventory.QTYGET}</SpanValue>
      </CardContent>
    </Card>
  );
}
