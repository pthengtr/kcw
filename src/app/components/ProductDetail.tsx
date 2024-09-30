"use client";
import cn from "@/app/lib/cn";
import { Prisma } from "@prisma/client";
import React, { useState, useEffect, useContext } from "react";
import ProductDetailCardLg from "./ProductDetailCardLg";
import ProductDetailCardSm from "./ProductDetailCardSm";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { supabase } from "../lib/supabase";

type ProductInfoFull = Prisma.ProductInfoGetPayload<{
  include: {
    location: true;
    price: true;
    priceM: true;
    unit: true;
    productCost: true;
  };
}>;

export type ProductDetailProps = {
  itemInfo: Prisma.ProductInfoGetPayload<{
    include: {
      location: true;
      price: true;
      priceM: true;
      unit: true;
      productCost: true;
    };
  }>;
};

export default function ProductDetail() {
  const [itemInfo, setItemInfo] = useState<ProductInfoFull>();

  const { selectedItem } = useContext(ProductContext) as ProductContextType;

  useEffect(() => {
    async function getDataSupabase() {
      const { data, error } = await supabase
        .from("productInfo")
        .select("*")
        .eq("BCODE", selectedItem)
        .limit(10);

      if (error) return;
      if (data !== null) setItemInfo(data[0]);
    }

    getDataSupabase();
  }, [selectedItem]);

  return (
    <div className="w-full h-full">
      {itemInfo && (
        <div className="h-full overflow-auto mx-8">
          <div className="grid w-full gap-6 md:grid-cols-1 justify-items-center">
            <ProductDetailCardLg itemInfo={itemInfo} />
            <ProductDetailCardSm itemInfo={itemInfo} />
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
