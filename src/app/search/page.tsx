import prisma from "@/app/lib/db";
import React from "react";
import { formatWordsSearch, formatSizeSearch } from "@/app/lib/util";

import ProductMain from "@/app/components/ProductMain";
import ProductHeader from "../components/ProductHeader";
import { dbTake } from "@/app/lib/util";

type SearchProps = {
  searchParams: {
    key: string;
    value: string;
    groups: string;
    category: string;
    size1: string;
    size2: string;
    size3: string;
    status: string;
    order: string;
    direction: string;
    page: string;
  };
};

export default async function Search({ searchParams }: SearchProps) {
  const {
    key,
    value,
    groups,
    category,
    size1,
    size2,
    size3,
    status,
    order = "DESCR",
    direction = "asc",
    page = 1,
  } = searchParams;

  let whereObj;

  if (key !== undefined && value !== undefined) {
    const searchWords = value.split(/[\s,]+/).map((word) => word.trim());

    const groupsNum =
      groups !== "all" ? groups.split(",").map((group) => Number(group)) : null;

    whereObj = formatWordsSearch(status, groupsNum, searchWords);
  } else {
    whereObj = formatSizeSearch(status, category, [size1, size2, size3]);
  }

  const skipItems = (Number(page) - 1) * 50;

  const totalFound = await prisma.productInfo.aggregate({
    _count: true,
    where: whereObj,
  });

  const itemList = await prisma.productInfo.findMany({
    where: whereObj,

    orderBy: {
      [order]: direction,
    },

    take: dbTake,
    skip: skipItems,
  });

  return (
    <div className="flex flex-col gap-2 h-full">
      <ProductHeader />
      <ProductMain
        itemListJson={JSON.stringify(itemList)}
        totalFound={totalFound._count}
      />
    </div>
  );
}
