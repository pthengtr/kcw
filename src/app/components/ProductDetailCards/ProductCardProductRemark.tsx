import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCardProductDate({
  itemInfo,
}: ProductDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>หมายเหตุ</CardTitle>
      </CardHeader>
      <CardContent>{itemInfo.REMARKS}</CardContent>
    </Card>
  );
}
