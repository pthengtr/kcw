import React from "react";
import ProductCardProductInfo from "./ProductDetailCards/ProductCardProductInfo";
import ProductCardProductCode from "./ProductDetailCards/ProductCardProductCode";
import ProductCardProductImage from "./ProductDetailCards/ProductCardProductImage";
import { ProductDetailProps } from "./ProductDetail";

export default function ProductDetailCardLg({ itemInfo }: ProductDetailProps) {
  return (
    <div className="grid gap-6 auto-rows-min mb-12 @[1024px]:grid-cols-[auto_auto]">
      <ProductCardProductInfo itemInfo={itemInfo} />
      <ProductCardProductCode itemInfo={itemInfo} />
      <ProductCardProductImage itemInfo={itemInfo} />
    </div>
  );
}
