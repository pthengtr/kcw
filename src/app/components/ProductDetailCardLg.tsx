import React from "react";
import ProductCardProductInfo from "./ProductDetailCards/ProductCardProductInfo";
import ProductCardProductCode from "./ProductDetailCards/ProductCardProductCode";
import ProductCardProductImage from "./ProductDetailCards/ProductCardProductImage";
import ProductCardProductTransaction from "./ProductDetailCards/ProductCardProductTransaction";
import { ProductDetailProps } from "./ProductDetail";

export default function ProductDetailCardLg({
  productDetail,
}: ProductDetailProps) {
  return (
    <div className="grid gap-6 auto-rows-min mb-12 @[1024px]:grid-cols-[auto_auto]">
      <ProductCardProductInfo productDetail={productDetail} />
      <ProductCardProductCode productDetail={productDetail} />
      <ProductCardProductImage productDetail={productDetail} />
      <ProductCardProductTransaction productDetail={productDetail} />
    </div>
  );
}
