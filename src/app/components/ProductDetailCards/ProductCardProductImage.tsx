import { ProductDetailProps } from "../ProductDetail";
import ImageWithFallback from "./ImageWithFallback";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductImage({
  itemInfo,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รูปสินค้า</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageWithFallback
          src={`https://pthengtr.github.io/kcw-product-pictures/pictures/${itemInfo.BCODE}.jpg`}
          alt={`kcw bcode ${itemInfo.BCODE} image`}
        />
      </CardContent>
    </Card>
  );
}
