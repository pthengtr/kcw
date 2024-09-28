import cn from "@/app/lib/cn";
import { Prisma } from "@prisma/client";
import ProductDetailCardLg from "./ProductDetailCardLg";
import ProductDetailCardSm from "./ProductDetailCardSm";

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

export default function ProductDetail({ itemInfo }: ProductDetailProps) {
  return (
    <>
      <div className="h-full overflow-auto mx-8">
        <div className="grid w-full gap-6 md:grid-cols-[auto_auto] justify-items-center">
          <ProductDetailCardLg itemInfo={itemInfo} />
          <ProductDetailCardSm itemInfo={itemInfo} />
        </div>
      </div>
    </>
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
