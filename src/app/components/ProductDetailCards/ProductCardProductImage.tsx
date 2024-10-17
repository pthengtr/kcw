import { ProductDetailProps } from "../ProductDetail";
import ImageWithFallback from "./ImageWithFallback";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductImage({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รูปสินค้า</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageWithFallback
          src={`https://pthengtr.github.io/kcw-product-pictures/pictures/${productDetail.BCODE}.jpg`}
          alt={`kcw bcode ${productDetail.BCODE} image`}
        />
      </CardContent>
    </Card>
  );
}
