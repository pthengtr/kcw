import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductDate({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>หมายเหตุ</CardTitle>
      </CardHeader>
      <CardContent>{productDetail.REMARKS}</CardContent>
    </Card>
  );
}
