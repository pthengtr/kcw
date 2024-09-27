import prisma from "@/app/lib/db";
import ProductDetail from "@/app/components/ProductDetail";
import { Prisma } from "@prisma/client";

type ProductProps = {
  params: {
    bcode: string;
  };
};

type ProductInfoFull = Prisma.ProductInfoGetPayload<{
  include: {
    location: true;
    price: true;
    priceM: true;
    unit: true;
    productCost: true;
  };
}>;

export default async function Product({ params }: ProductProps) {
  const itemInfo: ProductInfoFull | null = await prisma.productInfo.findUnique({
    where: {
      BCODE: params.bcode,
    },
    include: {
      productCost: true,
      location: true,
      price: true,
      priceM: true,
      unit: true,
    },
  });

  return <ProductDetail itemInfo={itemInfo as ProductInfoFull} />;
}
