"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const menu = [
  {
    name: "สินค้า",
    path: "/product",
  },
  {
    name: "ซื้อ-ขาย",
    path: "/transaction",
  },
];

export default function NavMenu() {
  const pathName = usePathname();

  return (
    <NavigationMenu className="text-white ">
      <NavigationMenuList className="flex gap-4">
        {menu.map((menu) => (
          <React.Fragment key={menu.name}>
            <NavigationMenuItem>
              <Link href={menu.path} legacyBehavior passHref>
                <NavigationMenuLink>{menu.name}</NavigationMenuLink>
              </Link>
              {menu.path === pathName && (
                <motion.div
                  layoutId="active-path"
                  className="border border-red-500"
                ></motion.div>
              )}
            </NavigationMenuItem>
          </React.Fragment>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
