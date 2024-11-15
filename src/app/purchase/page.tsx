import React from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import PurchasePage from "../components/Purchase/PurchasePage";
import PosProvider from "../components/Pos/PosProvider";
import PurchaseProvider from "../components/Purchase/PurchaseProvider";

export default async function Pos() {
  const session = await auth();
  const userName = session?.user?.name;

  if (!process.env.ALLOW_USER?.split(" ").includes(userName ? userName : "")) {
    return redirect("/");
  }

  return (
    <PosProvider>
      <PurchaseProvider>
        <PurchasePage />
      </PurchaseProvider>
    </PosProvider>
  );
}
