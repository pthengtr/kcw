import ProductHeader from "./ProductHeader";
import ProductMain from "./ProductMain";

type ProductSearchPageProps = {
  itemListJson: string;
  totalFound: number;
};

export default function ProductSearchPage({
  itemListJson,
  totalFound,
}: ProductSearchPageProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <ProductHeader />
      <ProductMain itemListJson={itemListJson} totalFound={totalFound} />
    </div>
  );
}
