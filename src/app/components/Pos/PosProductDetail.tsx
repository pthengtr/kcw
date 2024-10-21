"use client";
import React, { useEffect, useContext, useRef } from "react";

import {
  ProductContext,
  ProductContextType,
  productType,
} from "@/app/components/Product/ProductProvider";
import { supabase } from "@/app/lib/supabase";
import ProductCardProductPrice from "../Product/ProductDetailCards/ProductCardProductPrice";
import ProductCardProductStock from "../Product/ProductDetailCards/ProductCardProductStock";
import ProductCardProductUnit from "../Product/ProductDetailCards/ProductCardProductUnit";
import { Button } from "@/components/ui/button";
import PosProductImage from "./PosProductImage";
import { PosContext, PosContextType } from "./PosProvider";

export type PosProductDetailProps = { productDetail: productType };

export default function PosProductDetail() {
  const { selectedItem, productDetail, setProductDetail } = useContext(
    ProductContext
  ) as ProductContextType;

  const { handleClickAddToCart } = useContext(PosContext) as PosContextType;

  const productDetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productDetailRef.current?.scrollTo(0, 0);
  }, [productDetail]);

  useEffect(() => {
    async function getDataSupabase() {
      const { data, error } = await supabase
        .from("products")
        .select(`*`)
        .eq("BCODE", selectedItem)
        .limit(10);

      if (error) return;
      if (data !== null) setProductDetail(data[0]);
    }
    if (selectedItem !== "") getDataSupabase();
  }, [selectedItem, setProductDetail]);

  return (
    <div className="w-full h-full">
      {productDetail && (
        <div
          ref={productDetailRef}
          className="h-full flex gap-4 justify-center items-start overflow-auto mt-4"
        >
          <div className="flex flex-col gap-4 min-w-96">
            <PosProductImage productDetail={productDetail} />
          </div>
          <div className="flex flex-col gap-4 w-54">
            <ProductCardProductStock productDetail={productDetail} />
            <ProductCardProductUnit productDetail={productDetail} />
          </div>
          <div className="flex flex-col gap-4 w-48">
            <Button
              onClick={() => handleClickAddToCart(productDetail)}
              className="h-16 text-xl bg-secondary font-semibold hover:bg-red-700 flex gap-2 shadow-md"
            >
              <ShoppingCart />
              <span>เพิ่มสินค้า</span>
            </Button>
            <ProductCardProductPrice productDetail={productDetail} />
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingCart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentcolor"
    >
      <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
    </svg>
  );
}
