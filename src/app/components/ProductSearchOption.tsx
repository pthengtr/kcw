"use client";
import React, { useContext } from "react";
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
import { groupName, sizeCategory, groupProducts } from "../lib/util";
import { SearchContext, SearchContextType } from "./SearchProvider";

export default function ProductSearchOption() {
  const {
    searchGroup,
    searchKey,
    currentStatus,
    category,
    handleToggleStatus,
    handleSelect,
  } = useContext(SearchContext) as SearchContextType;
  return (
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
              <span className={searchKey === "SIZE" ? "font-bold" : undefined}>
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
                      <React.Fragment key={key}>
                        <DropdownMenuItem
                          onClick={() => handleSelect(key, "CODE")}
                          className={`${
                            key === searchGroup && searchKey === "CODE"
                              ? "font-bold"
                              : undefined
                          } last:border-t`}
                        >
                          {groupName[key]}
                        </DropdownMenuItem>
                      </React.Fragment>
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
  );
}
