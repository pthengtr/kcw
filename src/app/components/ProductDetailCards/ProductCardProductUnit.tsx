import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductUnit({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>หน่วยสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        <SpanName>ย่อย</SpanName>
        <SpanValue>{productDetail.UI1}</SpanValue>
        <SpanName>ใหญ่</SpanName>
        <SpanValue>{productDetail.UI2}</SpanValue>
        <SpanName>บรรจุ</SpanName>
        <SpanValue>{productDetail.MTP2}</SpanValue>
      </CardContent>
    </Card>
  );
}
