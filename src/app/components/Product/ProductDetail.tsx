"use client";
import cn from "@/app/lib/cn";
import React, { useEffect, useContext, useRef } from "react";
import ProductDetailCardLg from "./ProductDetailCardLg";
import ProductDetailCardSm from "./ProductDetailCardSm";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { supabase } from "../../lib/supabase";
import { productType } from "./ProductProvider";

export type ProductDetailProps = { productDetail: productType };

export default function ProductDetail() {
  const { selectedItem, productDetail, setProductDetail } = useContext(
    ProductContext
  ) as ProductContextType;

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
          className="h-full overflow-auto @container mx-8"
        >
          <div className="grid w-full gap-6 @[768px]:grid-cols-[auto_auto] justify-items-center @container">
            <ProductDetailCardLg productDetail={productDetail} />
            <ProductDetailCardSm productDetail={productDetail} />
            <div className="border w-full col-span-full mr-16"></div>
          </div>
        </div>
      )}
    </div>
  );
}

type ComponentProps = {
  children: React.ReactNode;
  className?: string;
};

export function SpanValue({ children, className }: ComponentProps) {
  return (
    <span
      className={cn(
        "bg-slate-200 rounded-sm px-1 text-center font-semibold text-nowrap grid place-content-center",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SpanName({ children, className }: ComponentProps) {
  return (
    <span className={cn("font-normal text-primary", className)}>
      {children}
    </span>
  );
}
