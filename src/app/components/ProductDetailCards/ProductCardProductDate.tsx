import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductDate({
  itemInfo,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
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
  );
}
