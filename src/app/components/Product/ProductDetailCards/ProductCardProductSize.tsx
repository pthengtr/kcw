import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import { sizeCategory, sizeType } from "@/app/lib/util";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductSize({
  productDetail,
}: ProductDetailProps) {
  return (
    <>
      {productDetail.CODE1 &&
        Object.keys(sizeCategory).includes(productDetail.CODE1) && (
          <Card>
            <CardHeader>
              <CardTitle>ขนาด</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-[1fr_2fr] gap-x-2 gap-1">
              <SpanName>
                {" "}
                {sizeType[productDetail.CODE1.toString()][0]}{" "}
              </SpanName>
              <SpanValue> {productDetail.SIZE1} </SpanValue>

              <SpanName>{sizeType[productDetail.CODE1.toString()][1]}</SpanName>
              <SpanValue>{productDetail.SIZE2}</SpanValue>

              {sizeType[productDetail.CODE1.toString()][2] && (
                <>
                  <SpanName>
                    {sizeType[productDetail.CODE1.toString()][2]}
                  </SpanName>
                  <SpanValue>{productDetail.SIZE3}</SpanValue>
                </>
              )}
            </CardContent>
          </Card>
        )}
    </>
  );
}
