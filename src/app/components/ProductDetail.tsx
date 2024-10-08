"use client";
import cn from "@/app/lib/cn";
import React, { useEffect, useContext, useRef } from "react";
import ProductDetailCardLg from "./ProductDetailCardLg";
import ProductDetailCardSm from "./ProductDetailCardSm";
import { ProductContext, ProductContextType } from "./ProductProvider";
import { supabase } from "../lib/supabase";

export type ItemDetailType = {
  MAIN: number;
  BCODE: string;
  DESCR: string;
  ACODE: string;
  XCODE: string;
  PCODE: string;
  MCODE: string;
  MODEL: string;
  BRAND: string;
  VENDOR: string;
  COSTSET1: string;
  PRICENET1: string;
  QTYOH2: string;
  QTYMIN: string;
  QTYMAX: string;
  QTYGET: string;
  CODE1: string;
  SIZE1: string;
  SIZE2: string;
  SIZE3: string;
  DATEUPDATE: string;
  DATEAUDIT: string;
  REMARKS: string;
  LOCATION1: string;
  productCost: {
    BCODE: string;
    ISVAT: string;
    COSTSET1: string;
    DISCNT: string;
    DISCNT1: string;
    DISCNT2: string;
    DISCNT3: string;
    DISCNT4: string;
    COSTNET: string;
  };
  productLocation: {
    BCODE: string;
    Attribute: string;
    Value: string;
  }[];
  productPrice: {
    BCODE: string;
    Attribute: string;
    Markup: string;
    Value: string;
  }[];
  productPriceM: {
    BCODE: string;
    Attribute: string;
    Markup: string;
    Value: string;
  }[];
  productUnit: {
    BCODE: string;
    Attribute: string;
    Value: string;
    NumberPerUnit: string;
  }[];
  billItemInfo: {
    id: number;
    BCODE: string;
    JOURDATE: Date;
    BILLDATE: Date;
    BILLNO: string;
    QTY: string;
    UI: string;
    MTP: string;
    PRICE: string;
    DISCNT1: string;
    DISCNT2: string;
    DISCNT3: string;
    DISCNT4: string;
    AMOUNT: string;
  }[];
};

export type ProductDetailProps = { itemDetail: ItemDetailType };

export default function ProductDetail() {
  const { selectedItem, itemDetail, setItemDetail } = useContext(
    ProductContext
  ) as ProductContextType;

  const productDetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productDetailRef.current?.scrollTo(0, 0);
  }, [itemDetail]);

  useEffect(() => {
    async function getDataSupabase() {
      const { data, error } = await supabase
        .from("productInfo")
        .select(
          `*, productCost(*), productUnit(*), productLocation(*), productPrice(*), productPriceM(*), billItems(*)`
        )
        .eq("BCODE", selectedItem)
        .limit(10);

      if (error) return;
      if (data !== null) setItemDetail(data[0]);
    }
    if (selectedItem !== "") getDataSupabase();
  }, [selectedItem, setItemDetail]);

  return (
    <div className="w-full h-full">
      {itemDetail && (
        <div
          ref={productDetailRef}
          className="h-full overflow-auto @container mx-8"
        >
          <div className="grid w-full gap-6 @[768px]:grid-cols-[auto_auto] justify-items-center @container">
            <ProductDetailCardLg itemDetail={itemDetail} />
            <ProductDetailCardSm itemDetail={itemDetail} />
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
