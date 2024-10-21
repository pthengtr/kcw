import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import ImageWithFallback from "@/app/components/Product/ProductDetailCards/ImageWithFallback";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PosProductImage({ productDetail }: ProductDetailProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="p-4">
        <CardTitle className="text-xl flex gap-2 font-normal justify-center">
          <span className="font-semibold">{productDetail.DESCR} | </span>
          <span>{productDetail.MODEL}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 w-96">
        <ImageWithFallback
          src={`https://pthengtr.github.io/kcw-product-pictures/pictures/${productDetail.BCODE}.jpg`}
          alt={`kcw bcode ${productDetail.BCODE} image`}
        />
      </CardContent>
    </Card>
  );
}
