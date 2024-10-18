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
import { authSignOut } from "@/app/lib/authUtils";

const menu = [
  {
    name: "สินค้า",
    path: "/product",
  },
  {
    name: "เจ้าหนี้",
    path: "/purchases",
  },
  {
    name: "ลูกหนี้",
    path: "/sales",
  },
];

export default function NavMenu() {
  const pathName = usePathname();

  return (
    <NavigationMenu className="text-white pr-16">
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
        <NavigationMenuItem
          className="hover:cursor-pointer"
          onClick={() => authSignOut()}
        >
          <LogoutIcon />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentcolor"
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
    </svg>
  );
}
