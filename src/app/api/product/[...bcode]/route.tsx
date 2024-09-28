import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "../../../lib/db";

type ProductInfoFull = Prisma.ProductInfoGetPayload<{
  include: {
    location: true;
    price: true;
    priceM: true;
    unit: true;
    productCost: true;
  };
}>;

type ParamProps = {
  params: {
    bcode: string;
  };
};

export async function GET(req: Request, { params }: ParamProps) {
  console.log(params);
  const itemInfo: ProductInfoFull | null = await prisma.productInfo.findUnique({
    where: {
      BCODE: params.bcode[0],
    },
    include: {
      productCost: true,
      location: true,
      price: true,
      priceM: true,
      unit: true,
    },
  });

  return NextResponse.json(itemInfo);
}
