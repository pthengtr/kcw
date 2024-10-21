import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductDate({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>หมายเหตุ</CardTitle>
      </CardHeader>
      <CardContent>{productDetail.REMARKS}</CardContent>
    </Card>
  );
}
