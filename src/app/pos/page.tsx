import React from "react";
import PosPage from "@/app/components/Pos/PosPage";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import PosProvider from "../components/Pos/PosProvider";

export default async function Pos() {
  const session = await auth();
  const userName = session?.user?.name;

  if (!process.env.ALLOW_USER?.split(" ").includes(userName ? userName : "")) {
    return redirect("/");
  }

  return (
    <PosProvider>
      <PosPage />
    </PosProvider>
  );
}
