"use client";
import cn from "@/app/lib/cn";
import React, { useEffect, useContext, useRef } from "react";
import ProductDetailCardLg from "./ProductDetailCardLg";
import ProductDetailCardSm from "./ProductDetailCardSm";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { supabase } from "../lib/supabase";

export type productType = {
  BCODE: string;
  XCODE: string;
  MCODE: string;
  PCODE: string;
  ACODE: string;
  DESCR: string;
  MODEL: string;
  BRAND: string;
  OEM: string;
  VENDOR: string;
  MAIN: number;
  UI1: string;
  UI2: string;
  MTP2: number;
  STATUS: number;
  LOCATION1: string;
  LOCATION2: string;
  CODE1: string;
  SIZE1: string;
  SIZE2: string;
  SIZE3: string;
  PRICE1: number;
  PRICE2: number;
  PRICE3: number;
  PRICE4: number;
  PRICE5: number;
  MARKUP1: number;
  MARKUP2: number;
  MARKUP3: number;
  MARKUP4: number;
  MARKUP5: number;
  PRICEM1: number;
  PRICEM2: number;
  PRICEM3: number;
  PRICEM4: number;
  PRICEM5: number;
  QTYOH2: number;
  QTYMIN: number;
  QTYMAX: number;
  QTYGET: number;
  QTYPUT: number;
  DATEUPDATE: Date;
  DATEAUDIT: Date;
  REMARKS: string;
};

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
