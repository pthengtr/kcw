"use client";
import React, { useEffect, useContext, useRef } from "react";

import {
  ProductContext,
  ProductContextType,
  productType,
} from "@/app/components/Product/ProductProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/components/ui/button";
import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { PosContext, PosContextType } from "./PosProvider";
import ImageWithFallback from "@/app/components/Product/ProductDetailCards/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { priceName } from "./PosProvider";
import { Separator } from "@/components/ui/separator";
import { sizeType, sizeCategory } from "@/app/lib/util";

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
        .select(`*, prices(*), prices_m(*), inventory(*)`)
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
          className="h-full flex-col flex gap-4 justify-start items-start overflow-auto p-4"
        >
          <Button
            onClick={() => handleClickAddToCart(productDetail)}
            className="h-16 text-xl bg-secondary font-semibold hover:bg-red-700 flex gap-2 shadow-md w-full"
          >
            <ShoppingCart />
            <span>เพิ่มสินค้า</span>
          </Button>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 font-normal justify-center">
                <span className="font-semibold">{productDetail.DESCR}</span>
                <span className="border"></span>
                <span>{productDetail.MODEL}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ImageWithFallback
                src={`https://pthengtr.github.io/kcw-product-pictures/pictures/${productDetail.BCODE}.jpg`}
                alt={`kcw bcode ${productDetail.BCODE} image`}
              />

              <Separator />
              <div className="flex justify-center gap-4">
                <div className="grid place-content-center">
                  <span className="text-xl font-bold">ราคาสินค้า</span>
                </div>
                <div className="grid place-content-center">
                  <SpanValue className="text-5xl px-4 py-2 bg-primary text-white">
                    {productDetail.PRICE1.toLocaleString()}
                  </SpanValue>
                </div>

                <div>
                  <Accordion type="multiple">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-gray-500">
                        ราคาพิเศษ
                      </AccordionTrigger>
                      <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
                        {productDetail.prices?.map((price) => (
                          <React.Fragment key={price.Attribute}>
                            <SpanName>
                              {
                                priceName[
                                  price.Attribute as keyof typeof priceName
                                ]
                              }
                            </SpanName>
                            <SpanValue>{price.Value}</SpanValue>
                          </React.Fragment>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    {!!productDetail.prices_m &&
                      productDetail.prices_m.length > 0 && (
                        <AccordionItem value="item-2">
                          <AccordionTrigger className="text-gray-500">
                            {`ราคา${
                              productDetail.UI2
                                ? productDetail.UI2
                                : "หน่วยใหญ่"
                            }`}
                          </AccordionTrigger>

                          <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
                            {productDetail.prices_m?.map((price) => (
                              <React.Fragment key={price.Attribute}>
                                <SpanName>
                                  {
                                    priceName[
                                      price.Attribute as keyof typeof priceName
                                    ]
                                  }
                                </SpanName>
                                <SpanValue>{price.Value}</SpanValue>
                              </React.Fragment>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                  </Accordion>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_2fr] gap-y-1 gap-x-4">
                {!!productDetail.PCODE && (
                  <>
                    <SpanName>เบอร์ 1 (แท้)</SpanName>
                    <SpanValue>{productDetail.PCODE}</SpanValue>
                  </>
                )}
                {!!productDetail.MCODE && (
                  <>
                    <SpanName>เบอร์ 2 (โรงงาน)</SpanName>
                    <SpanValue>{productDetail.MCODE}</SpanValue>
                  </>
                )}
              </div>

              {productDetail.CODE1 &&
                Object.keys(sizeCategory).includes(productDetail.CODE1) && (
                  <div className="flex gap-8">
                    <div>
                      <SpanName>
                        {sizeType[productDetail.CODE1.toString()][0]}
                      </SpanName>
                      <SpanName>
                        {" x "}
                        {sizeType[productDetail.CODE1.toString()][1]}
                      </SpanName>
                      {sizeType[productDetail.CODE1.toString()][2] && (
                        <SpanName>
                          {" x "}
                          {sizeType[productDetail.CODE1.toString()][2]}
                        </SpanName>
                      )}
                    </div>

                    <SpanValue className="flex-1">
                      {productDetail.SIZE1}
                      {" x "}
                      {productDetail.SIZE2}
                      {sizeType[productDetail.CODE1.toString()][2] && (
                        <>
                          {" x "}
                          {productDetail.SIZE3}
                        </>
                      )}
                    </SpanValue>
                  </div>
                )}
            </CardContent>
          </Card>
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
