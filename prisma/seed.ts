import { PrismaClient } from "@prisma/client";
import productInfoData from "./json/Lookup-ProductInfo.json";
// import productDiscountData from "./json/Lookup-ProductDiscount.json";
// import productLocationData from "./json/Lookup-ProductLocation.json";
// import productPriceData from "./json/Lookup-ProductPrice.json";
// import productPriceMData from "./json/Lookup-ProductPriceM.json";
// import productUnit from "./json/Lookup-ProductUnit.json";
// import productInfoSampleData from "./json/Lookup-ProductInfo-sample.json";

const prisma = new PrismaClient();

async function main() {
  let count: number = 0;
  for (const index in Object.keys(productInfoData)) {
    await prisma.productInfo.create({
      data: productInfoData[index],
    });

    count += 1;
    if (count % 1000 === 0) {
      console.log(`${count} created`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
