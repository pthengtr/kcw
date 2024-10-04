import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCardBuy from "./ProductCardBuy";
import ProductCardSell from "./ProductCardSell";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function ProductCardProductTransaction({
  itemInfo,
}: ProductDetailProps) {
  return (
    <Card className="max-h-fit">
      <CardHeader className="grid place-content-center">
        <CardTitle>ประวัติสินค้า</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid place-content-center">
          <Drawer>
            <DrawerTrigger>
              <Button className="bg-gray-200">เช็คประวัติ ซื้อ-ขาย</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="grid grid-cols-2 justify-items-center gap-8 m-16">
                <ProductCardBuy itemInfo={itemInfo} />
                <ProductCardSell itemInfo={itemInfo} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  );
}
