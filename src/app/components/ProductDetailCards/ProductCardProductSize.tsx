import { SpanValue, SpanName } from "../ProductDetail";
import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { sizeCategory, sizeType } from "../../lib/util";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductSize({
  itemInfo,
}: ProductDetailProps) {
  return (
    <>
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
    </>
  );
}
