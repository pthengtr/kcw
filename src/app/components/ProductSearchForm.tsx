"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { groupName, sizeCategory, sizeType } from "../lib/util";
import { ProductContext, ProductContextType } from "./ProductProvider";

const groupProducts: Record<string, string[]> = {
  รถไถ: ["12", "30", "31", "35"],
  รถยนต์: ["3", "5", "7", "8", "11", "16", "23", "29"],
  "รถใหญ่ 6-10 ล้อ": ["1", "2", "4", "6", "9", "10", "28"],
  "แมคโคร โฟล์คลิฟท์": ["32", "34"],
  "น้ำมัน แบตฯ": ["21", "22"],
  อื่นๆ: ["13", "14", "15", "17,18,19,20", "25", "26"],
  บริการ: ["33", "40"],
};

export default function ProductSearchForm() {
  const [searchText, setSearchText] = React.useState("");
  const [searchGroup, setSearchGroup] = React.useState("all");
  const [searchKey, setSearchKey] = React.useState("CODE");
  const [currentStatus, setCurrentStatus] = React.useState(true);

  const [size1, setSize1] = React.useState("");
  const [size2, setSize2] = React.useState("");
  const [size3, setSize3] = React.useState("");

  const { category, setCategory } = useContext(
    ProductContext
  ) as ProductContextType;

  function handleToggleStatus() {
    setCurrentStatus((cur) => !cur);
  }

  const router = useRouter();

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (searchKey === "CODE") {
      router.push(
        `/search?key=CODE&groups=${searchGroup}&value=${searchText}&status=${currentStatus}`
      );
    } else {
      router.push(
        `/search?key=SIZE&category=${category}&size1=${size1}&size2=${size2}&size3=${size3}&status=${currentStatus.toString()}`
      );
    }
  }

  function handleSelect(value: string, key: string) {
    setSearchKey(key);

    if (key === "CODE") {
      setSearchGroup(value);
    } else if (key === "SIZE") {
      setCategory(value);
    }
  }

  return (
    <form onSubmit={handleSubmitForm} className="flex gap-2 items-center">
      <div className="w-[500px] flex flex-auto shadow-lg">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex gap-2 border rounded-l-md p-1 bg-gray-100 items-center h-full">
              {searchKey === "CODE" && (
                <span className="ml-2 font-semibold text-[0.9rem]">
                  {groupName[searchGroup]}
                </span>
              )}

              {searchKey === "SIZE" && (
                <span className="ml-2 font-semibold  text-[0.9rem]">
                  {sizeCategory[category]}
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleSelect("all", "CODE")}
                className={
                  searchGroup === "all" && searchKey === "CODE"
                    ? "font-bold"
                    : undefined
                }
              >
                ทั้งหมด
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="">
                  <span
                    className={searchKey === "SIZE" ? "font-bold" : undefined}
                  >
                    ตามขนาด
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.keys(sizeCategory).map((key) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => handleSelect(key, "SIZE")}
                      className={
                        key === category && searchKey === "SIZE"
                          ? "font-bold"
                          : undefined
                      }
                    >
                      {sizeCategory[key]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {Object.keys(groupProducts).map((productKey) => (
                <DropdownMenuSub key={productKey}>
                  <DropdownMenuSubTrigger
                    className={
                      groupProducts[productKey].includes(searchGroup) &&
                      searchKey === "CODE"
                        ? "font-bold"
                        : undefined
                    }
                  >
                    {productKey}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {Object.keys(groupName).map(
                      (key) =>
                        groupProducts[productKey].includes(key) && (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => handleSelect(key, "CODE")}
                            className={
                              key === searchGroup && searchKey === "CODE"
                                ? "font-bold"
                                : undefined
                            }
                          >
                            {groupName[key]}
                          </DropdownMenuItem>
                        )
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleToggleStatus}
                className={currentStatus ? "font-bold" : undefined}
              >
                เฉพาะ KCW
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {searchKey === "CODE" && (
          <input
            className="border rounded-r-md p-1 flex-1"
            type="text"
            placeholder="ชือ หรือ รหัสสินค้า..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}

        {searchKey === "SIZE" && (
          <div className="flex flex-1 w-32">
            <input
              className="border min-w-12 p-1"
              type="text"
              placeholder={sizeType[category][0]}
              value={size1}
              onChange={(e) => setSize1(e.target.value)}
            />
            <input
              className="border min-w-12 p-1"
              type="text"
              placeholder={sizeType[category][1]}
              value={size2}
              onChange={(e) => setSize2(e.target.value)}
            />
            <input
              className="border min-w-12 rounded-r-md p-1 disabled:bg-gray-200"
              type="text"
              placeholder={sizeType[category][2] || ""}
              disabled={sizeType[category][2] ? false : true}
              value={size3}
              onChange={(e) => setSize3(e.target.value)}
            />
          </div>
        )}
      </div>
      <Button className="bg-gray-100 h-full text-gray-800 shadow-lg font-semibold hover:bg-slate-200 hover:scale-[1.02] active:scale-[1]">
        ค้นหา
      </Button>
    </form>
  );
}
