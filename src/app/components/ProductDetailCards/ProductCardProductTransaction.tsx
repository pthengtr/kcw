import { ProductDetailProps } from "../ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCardBuy from "./ProductCardBuy";
import ProductCardSell from "./ProductCardSell";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function ProductCardProductTransaction({
  itemDetail,
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
              <Button className="hover:bg-blue-900">
                เช็คประวัติ ซื้อ-ขาย
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="flex justify-center gap-4 text-2xl mt-8">
                <span>{itemDetail.BCODE}</span>
                <span className="font-semibold">{itemDetail.DESCR}</span>
                <span>{itemDetail.MODEL}</span>
              </div>
              <div className="grid grid-cols-2 justify-items-center gap-8 m-8">
                <ProductCardBuy itemDetail={itemDetail} />
                <ProductCardSell itemDetail={itemDetail} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  );
}
