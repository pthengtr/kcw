import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductDate({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
        {productDetail.DATEUPDATE !== null ? (
          <>
            <SpanName>ซื้อเข้า</SpanName>
            <SpanValue>
              {new Date(productDetail.DATEUPDATE).toLocaleDateString("th-TH")}
            </SpanValue>
          </>
        ) : (
          <></>
        )}
        {productDetail.DATEAUDIT !== null ? (
          <>
            <SpanName>เช็คสต๊อก</SpanName>
            <SpanValue>
              {new Date(productDetail.DATEAUDIT).toLocaleDateString("th-TH")}
            </SpanValue>
          </>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}
