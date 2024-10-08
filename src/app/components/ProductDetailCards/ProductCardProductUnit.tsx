import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductUnit({
  itemDetail,
}: ProductDetailProps) {
  let ui1text = "",
    ui2text = "",
    ui2number = "";
  itemDetail.productUnit.forEach((item) => {
    if (item.Attribute === "UI1") {
      ui1text = item.Value;
    } else if (item.Attribute === "UI2") {
      ui2text = item.Value;
      ui2number = item.NumberPerUnit.toString();
    }
  });
  return (
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
  );
}
