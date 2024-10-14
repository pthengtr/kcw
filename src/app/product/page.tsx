import React from "react";
import ProductSearchPage from "../components/ProductSearchPage";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Product() {
  const session = await auth();
  const userName = session?.user?.name;

  if (!process.env.ALLOW_USER?.split(" ").includes(userName ? userName : "")) {
    return redirect("/");
  }

  return <ProductSearchPage />;
}
