import ProductCardProductPrice from "./ProductDetailCards/ProductCardProductPrice";
import ProductCardProductCost from "./ProductDetailCards/ProductCardProductCost";
import ProductCardProductSize from "./ProductDetailCards/ProductCardProductSize";
import ProductCardProductStock from "./ProductDetailCards/ProductCardProductStock";
import ProductCardProductUnit from "./ProductDetailCards/ProductCardProductUnit";
import ProductCardProductDate from "./ProductDetailCards/ProductCardProductDate";
import ProductCardProductRemark from "./ProductDetailCards/ProductCardProductRemark";
import { ProductDetailProps } from "./ProductDetail";
import React from "react";

export default function ProductDetailSection2({
  itemDetail,
}: ProductDetailProps) {
  return (
    <div className="grid grid-cols-2 gap-6 @[760px]:grid-cols-1 @[768px]:items-start @[768px]:auto-rows-min @[1024px]:grid-cols-[auto_auto]">
      <ProductCardProductPrice itemDetail={itemDetail} />
      <ProductCardProductSize itemDetail={itemDetail} />
      <ProductCardProductStock itemDetail={itemDetail} />
      <ProductCardProductUnit itemDetail={itemDetail} />
      <ProductCardProductCost itemDetail={itemDetail} />
      <ProductCardProductDate itemDetail={itemDetail} />
      <ProductCardProductRemark itemDetail={itemDetail} />
    </div>
  );
}
