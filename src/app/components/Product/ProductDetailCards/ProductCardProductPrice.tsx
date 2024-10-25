import { SpanValue, SpanName } from "@/app/components/Product/ProductDetail";
import { ProductDetailProps } from "@/app/components/Product/ProductDetail";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { priceName } from "../../Pos/PosProvider";

export default function ProductCardProductPrice({
  productDetail,
}: ProductDetailProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="grid place-content-center">
        <CardTitle>ราคาสินค้า</CardTitle>
      </CardHeader>
      <CardContent className="grid place-content-center">
        <SpanValue className="text-5xl px-4 py-2 bg-primary text-white">
          {productDetail.PRICE1.toLocaleString()}
        </SpanValue>
      </CardContent>

      <CardContent>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-500">
              ราคาพิเศษ
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
              {productDetail.prices?.map((price) => (
                <React.Fragment key={price.Attribute}>
                  <SpanName>
                    {priceName[price.Attribute as keyof typeof priceName]}
                  </SpanName>
                  <SpanValue>{price.Value}</SpanValue>
                </React.Fragment>
              ))}
            </AccordionContent>
          </AccordionItem>
          {!!productDetail.prices_m && productDetail.prices_m.length > 0 && (
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-gray-500">
                {`ราคา${productDetail.UI2 ? productDetail.UI2 : "หน่วยใหญ่"}`}
              </AccordionTrigger>

              <AccordionContent className="grid grid-cols-[1fr_2fr] gap-1">
                {productDetail.prices_m?.map((price) => (
                  <React.Fragment key={price.Attribute}>
                    <SpanName>
                      {priceName[price.Attribute as keyof typeof priceName]}
                    </SpanName>
                    <SpanValue>{price.Value}</SpanValue>
                  </React.Fragment>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
