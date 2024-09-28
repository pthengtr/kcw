import prisma from "@/app/lib/db";
import React from "react";
import { formatWordsSearch, formatSizeSearch } from "@/app/lib/util";
import { dbTake } from "@/app/lib/util";
import ProductSearchPage from "../components/ProductSearchPage";

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
    key = "CODE",
    value = "",
    groups = "all",
    category,
    size1,
    size2,
    size3,
    status = "true",
    order = "DESCR",
    direction = "asc",
    page = 1,
  } = searchParams;

  let whereObj;

  if (key === "CODE") {
    const searchWords = value.split(/[\s,]+/).map((word) => word.trim());

    const groupsNum =
      groups !== "all" ? groups.split(",").map((group) => Number(group)) : null;

    whereObj = formatWordsSearch(status, groupsNum, searchWords);
  } else if (key === "SIZE") {
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
    <ProductSearchPage
      itemListJson={JSON.stringify(itemList)}
      totalFound={totalFound._count}
    />
  );
}
